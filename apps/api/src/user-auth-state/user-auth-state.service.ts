import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { getMinutesRemaining } from "../common/utils/date.utils";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserAuthStateService {
	private readonly MAX_LOGIN_ATTEMPTS = 3;
	private readonly FAILED_LOGIN_LOCK_DURATION: number;

	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
	) {
		this.FAILED_LOGIN_LOCK_DURATION =
			this.configService.get<number>("FAILED_LOGIN_LOCK_DURATION_IN_MINUTES", 15) * 1000 * 60;
	}

	find(userId: string) {
		return this.prismaService.userAuthState.findUnique({
			where: { userId },
		});
	}

	async incrementFailedLoginAttempts(userId: string) {
		const now = new Date();

		return this.prismaService.userAuthState.upsert({
			where: { userId },
			create: {
				userId: userId,
				lastAttemptAt: now,
			},
			update: {
				failedLoginAttempts: { increment: 1 },
				lastAttemptAt: now,
			},
		});
	}

	async resetFailedLoginAttempts(userId: string) {
		await this.prismaService.userAuthState.update({
			where: { userId },
			data: { failedLoginAttempts: 0, lockedUntil: null },
		});
	}

	async throwIfLocked(userId: string) {
		const now = new Date();
		const userAuthState = await this.find(userId);

		if (userAuthState && userAuthState.lockedUntil && userAuthState.lockedUntil > now) {
			throw new UnauthorizedException({
				message: "common.message.accountLocked",
				payload: { minutes: getMinutesRemaining(userAuthState.lockedUntil) },
			});
		}
	}

	async handleFailure(userId: string) {
		const { failedLoginAttempts } = await this.incrementFailedLoginAttempts(userId);

		if (failedLoginAttempts >= this.MAX_LOGIN_ATTEMPTS) await this.lockAndThrow(userId);

		throw new UnauthorizedException("common.message.invalidCredentials");
	}

	async lockAndThrow(userId: string) {
		const lockedUntil = new Date(Date.now() + this.FAILED_LOGIN_LOCK_DURATION);

		await this.prismaService.userAuthState.update({
			where: { userId },
			data: { lockedUntil },
		});

		throw new UnauthorizedException({
			message: "common.message.accountLocked",
			payload: { minutes: getMinutesRemaining(lockedUntil) },
		});
	}
}
