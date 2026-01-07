import { ConflictException, Injectable } from "@nestjs/common";
import { SendOtpViaEmailInput } from "./inputs/send-otp-via-email.input";
import { UserService } from "../user/user.service";
import { ConfigService } from "@nestjs/config";
import { randomInt } from "crypto";
import { PrismaService } from "../prisma/prisma.service";
import { hash, verify } from "argon2";
import { MailTemplateService } from "../mail/mail-template.service";
import { VerifyOtpInput } from "./inputs/verify-otp.input";
import { OtpAttemptService } from "../otp-attempt/otp-attempt.service";
import { OtpType, TokenType } from "../generated/prisma/enums";
import { TokenService } from "../token/token.service";
import { OtpAttemptInput } from "../otp-attempt/inputs/otp-attempt.input";
import { OtpInput } from "./inputs/otp.input";
import cuid from "cuid";

@Injectable()
export class OtpService {
	private readonly OTP_DURATION: number;
	private readonly OTP_LENGTH: number;

	constructor(
		private readonly configService: ConfigService,
		private readonly prismaService: PrismaService,
		private readonly userService: UserService,
		private readonly mailTemplateService: MailTemplateService,
		private readonly otpAttemptService: OtpAttemptService,
		private readonly tokenService: TokenService,
	) {
		this.OTP_DURATION = configService.get<number>("OTP_DURATION_IN_MINUTES", 5) * 1000 * 60;
		this.OTP_LENGTH = configService.get<number>("OTP_LENGTH", 6);
	}

	findOne(id: string) {
		return this.prismaService.otp.findFirst({
			where: {
				id,
				expiresAt: { gte: new Date() },
			},
		});
	}

	async reissue(input: OtpInput) {
		await this.remove(input);
		return this.create(input);
	}

	async create(input: OtpInput) {
		const expiry = new Date(Date.now() + this.OTP_DURATION);
		const code = this.generate();
		const hashedCode = await hash(code);

		const otp = await this.prismaService.otp.create({
			data: {
				code: hashedCode,
				type: input.type,
				userId: input.userId,
				expiresAt: expiry,
			},
		});

		return {
			code,
			id: otp.id,
		};
	}

	async remove(input: OtpInput) {
		await this.prismaService.otp.deleteMany({
			where: {
				userId: input.userId,
				type: input.type,
			},
		});
	}

	async sendViaEmail(input: SendOtpViaEmailInput) {
		const user = await this.userService.findOneByEmail(input.email);
		let token = cuid();

		if (user) {
			const otp = await this.reissue({ userId: user.id, type: input.type });

			await this.mailTemplateService.sendOtp({
				subject: input.subject,
				recipients: [input.email],
				code: otp.code,
			});

			token = otp.id;
		}

		return { token };
	}

	async verifyCode(input: VerifyOtpInput) {
		const otp = await this.findOne(input.id);

		if (!otp) {
			throw new ConflictException({
				message: [{ field: "code", error: ["common.validation.invalidOtp"] }],
			});
		}

		const user = await this.userService.findOne(otp.userId);

		if (!user) {
			throw new ConflictException({
				message: [{ field: "code", error: ["common.validation.invalidOtp"] }],
			});
		}

		const otpAttemptPayload: OtpAttemptInput = { userId: otp.userId, type: otp.type };

		await this.otpAttemptService.throwIfLocked(otpAttemptPayload);

		if (!(await verify(otp.code, input.code))) {
			await this.otpAttemptService.handleFailure(otpAttemptPayload);
			return;
		}

		await this.remove({ type: otp.type, userId: otp.userId });
		await this.otpAttemptService.reset(otpAttemptPayload);

		switch (otp.type) {
			case OtpType.FORGOT_PASSWORD: {
				const { tokenId, token } = await this.tokenService.reissue({
					userId: user.id,
					type: TokenType.PASSWORD_RESET,
				});

				return { nextStep: `reset-password?tokenId=${tokenId}&token=${token}` };
			}

			case OtpType.PASSWORD_RESET: {
				const { tokenId, token } = await this.tokenService.reissue({
					userId: user.id,
					type: TokenType.PASSWORD_RESET,
				});

				return { nextStep: `reset-password?tokenId=${tokenId}&token=${token}` };
			}

			default:
				return true;
		}
	}

	private generate(length: number = this.OTP_LENGTH): string {
		return Array.from({ length }, () => randomInt(0, 10)).join("");
	}
}
