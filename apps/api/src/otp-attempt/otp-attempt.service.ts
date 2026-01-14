import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { OtpAttemptInput } from "./inputs/otp-attempt.input";
import { PrismaService } from "../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { getMinutesRemaining } from "../common/utils/date.utils";

@Injectable()
export class OtpAttemptService {
	private readonly OTP_LOCK_DURATION: number;
	private readonly MAX_OTP_ATTEMPTS: number;

	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
	) {
		this.MAX_OTP_ATTEMPTS = 3;
		this.OTP_LOCK_DURATION =
			configService.get<number>("OTP_LOCK_DURATION_IN_MINUTES", 15) * 1000 * 60;
	}

	async handleFailure(input: OtpAttemptInput) {
		const { failedAttempts } = await this.increase(input);

		if (failedAttempts >= this.MAX_OTP_ATTEMPTS) await this.lockAndThrow(input);

		throw new ConflictException({
			message: [{ field: "code", error: ["common.validation.invalidOtp"] }],
		});
	}

	async increase(input: OtpAttemptInput) {
		const now = new Date();

		return this.prismaService.otpAttempt.upsert({
			where: { userId_type: input },
			create: {
				userId: input.userId,
				type: input.type,
				failedAttempts: 1,
				lastAttemptAt: now,
				lockedUntil: null,
			},
			update: {
				failedAttempts: { increment: 1 },
				lastAttemptAt: now,
			},
		});
	}

	async lockAndThrow(input: OtpAttemptInput) {
		const lockedUntil = new Date(Date.now() + this.OTP_LOCK_DURATION);

		await this.prismaService.otpAttempt.update({
			where: { userId_type: input },
			data: { lockedUntil },
		});

		throw new BadRequestException({
			message: "common.message.maxOtpAttempts",
			payload: {
				minutes: getMinutesRemaining(lockedUntil),
			},
		});
	}

	async reset(input: OtpAttemptInput) {
		const now = new Date();

		await this.prismaService.otpAttempt.upsert({
			where: { userId_type: input },
			create: {
				userId: input.userId,
				type: input.type,
				failedAttempts: 0,
				lastAttemptAt: now,
				lockedUntil: null,
			},
			update: {
				failedAttempts: 0,
				lastAttemptAt: now,
				lockedUntil: null,
			},
		});
	}

	async throwIfLocked(input: OtpAttemptInput) {
		const now = new Date();

		const otpAttempt = await this.prismaService.otpAttempt.findUnique({
			where: { userId_type: input },
		});

		if (otpAttempt?.lockedUntil && otpAttempt.lockedUntil > now) {
			throw new BadRequestException({
				message: "common.message.maxOtpAttempts",
				payload: {
					minutes: getMinutesRemaining(otpAttempt.lockedUntil),
				},
			});
		}
	}
}
