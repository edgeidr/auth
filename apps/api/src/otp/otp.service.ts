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

	findOne(input: OtpInput) {
		return this.prismaService.otp.findFirst({
			where: {
				userId: input.userId,
				type: input.type,
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
			expiresAt: otp.expiresAt,
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
		let expiresAt = new Date(Date.now() + this.OTP_DURATION);

		if (user) {
			const otp = await this.reissue({ userId: user.id, type: input.type });

			await this.mailTemplateService.sendOtp({
				subject: input.subject,
				recipients: [input.email],
				code: otp.code,
			});

			expiresAt = otp.expiresAt;
		}

		return { expiresAt };
	}

	async verifyCode(input: VerifyOtpInput) {
		const user = await this.userService.findOneByEmail(input.email);

		if (!user) {
			throw new ConflictException({
				message: [{ field: "code", error: ["common.validation.invalidOtp"] }],
			});
		}

		const otpAttemptPayload: OtpAttemptInput = { userId: user.id, type: input.type };

		await this.otpAttemptService.throwIfLocked(otpAttemptPayload);

		const otp = await this.findOne(otpAttemptPayload);

		if (!otp || !(await verify(otp.code, input.code))) {
			await this.otpAttemptService.handleFailure(otpAttemptPayload);
		}

		await this.otpAttemptService.reset(otpAttemptPayload);

		switch (input.type) {
			case OtpType.FORGOT_PASSWORD:
				return this.tokenService.reissue({
					userId: user.id,
					type: TokenType.PASSWORD_RESET,
				});

			default:
				return true;
		}
	}

	private generate(length: number = this.OTP_LENGTH): string {
		return Array.from({ length }, () => randomInt(0, 10)).join("");
	}
}
