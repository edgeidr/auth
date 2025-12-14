import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserAuthStateService {
	private readonly MAX_LOGIN_ATTEMPTS = 3;
	private readonly FAILED_LOGIN_LOCK_DURATION_IN_MINUTES = 15;

	constructor(private readonly prismaService: PrismaService) {}

	find(userId: string) {
		return this.prismaService.userAuthState.findUnique({
			where: { userId },
		});
	}

	create(userId: string) {
		return this.prismaService.userAuthState.create({
			data: { userId },
		});
	}

	async findOrCreate(userId: string) {
		let userAuthState = await this.find(userId);

		if (!userAuthState) userAuthState = await this.create(userId);

		return userAuthState;
	}

	async isAccountLocked(userId: string) {
		const userAuthState = await this.findOrCreate(userId);

		return (
			userAuthState.failedLoginAttempts >= this.MAX_LOGIN_ATTEMPTS &&
			userAuthState.lockedUntil &&
			userAuthState.lockedUntil > new Date()
		);
	}

	async incrementFailedLoginAttempts(userId: string) {
		const userAuthState = await this.findOrCreate(userId);

		const lockedUntil =
			userAuthState.failedLoginAttempts >= this.MAX_LOGIN_ATTEMPTS - 1
				? new Date(Date.now() + this.FAILED_LOGIN_LOCK_DURATION_IN_MINUTES * 60 * 1000)
				: null;

		await this.prismaService.userAuthState.update({
			where: { userId },
			data: {
				failedLoginAttempts: { increment: 1 },
				lockedUntil,
			},
		});
	}

	async resetFailedLoginAttempts(userId: string) {
		await this.prismaService.userAuthState.update({
			where: { userId },
			data: { failedLoginAttempts: 0, lockedUntil: null },
		});
	}
}
