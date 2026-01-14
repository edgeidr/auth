import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ValidateCredentialsInput } from "./inputs/validate-credentials.input";
import { FindUserOptions } from "./types/find-user-options";
import { PrismaService } from "../prisma/prisma.service";
import { hash, verify } from "argon2";
import { UserAuthStateService } from "../user-auth-state/user-auth-state.service";
import { CreateUserInput } from "./inputs/create-user.input";
import { userSelect } from "../../prisma/selects/user.select";
import { userProfileSelect } from "../../prisma/selects/user-profile.select";
import { UpdatePasswordInput } from "./inputs/update-password.input";
import { LinkGoogleInput } from "./inputs/link-google.input";
import { UpdateUserProfileInput } from "./inputs/update-user-profile.input";
import { UpdateEmailInput } from "./inputs/update-email.input";

@Injectable()
export class UserService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly userAuthStateService: UserAuthStateService,
	) {}

	private buildSelect(options: FindUserOptions = {}) {
		return {
			...userSelect,
			password: options.include?.password,
			googleSub: options.include?.googleSub,
			githubId: options.include?.githubId,
			userProfile: options.include?.userProfile ? { select: userProfileSelect } : false,
		};
	}

	async create(input: CreateUserInput) {
		return this.prismaService.user.create({
			data: {
				email: input.email,
				emailVerifiedAt: input.emailUpdatedAt,
				emailUpdatedAt: input.emailUpdatedAt,
				password: input.password ? await hash(input.password) : null,
				passwordUpdatedAt: new Date(),
				googleSub: input.googleSub,
				githubId: input.githubId,
				userProfile: {
					create: {
						firstName: input.firstName,
						lastName: input.lastName,
						photoUrl: input.photoUrl,
					},
				},
			},
			select: this.buildSelect(),
		});
	}

	findOne(id: string, options: FindUserOptions = {}) {
		return this.prismaService.user.findUnique({
			where: {
				id,
				isActive: options.include?.inactive ? undefined : true,
				deletedAt: null,
			},
			select: this.buildSelect(options),
		});
	}

	findOneByEmail(email: string, options: FindUserOptions = {}) {
		return this.prismaService.user.findUnique({
			where: {
				email,
				isActive: options.include?.inactive ? undefined : true,
				deletedAt: null,
			},
			select: this.buildSelect(options),
		});
	}

	findOneByGoogleSub(googleSub: string, options: FindUserOptions = {}) {
		return this.prismaService.user.findUnique({
			where: {
				googleSub,
				isActive: options.include?.inactive ? undefined : true,
				deletedAt: null,
			},
			select: this.buildSelect(options),
		});
	}

	findOneByGithubId(githubId: string, options: FindUserOptions = {}) {
		return this.prismaService.user.findUnique({
			where: {
				githubId,
				isActive: options.include?.inactive ? undefined : true,
				deletedAt: null,
			},
			select: this.buildSelect(options),
		});
	}

	async validateCredentials(input: ValidateCredentialsInput) {
		const user = await this.findOneByEmail(input.email, {
			include: {
				password: true,
				googleSub: true,
				githubId: true,
			},
		});

		if (!user) throw new UnauthorizedException("common.message.invalidCredentials");

		const isAccountLocked = await this.userAuthStateService.isAccountLocked(user.id);
		if (isAccountLocked) throw new UnauthorizedException("common.message.accountLocked");

		const passwordMatches = !!user.password && (await verify(user.password, input.password));

		if (!passwordMatches) {
			await this.userAuthStateService.incrementFailedLoginAttempts(user.id);
			throw new UnauthorizedException("common.message.invalidCredentials");
		}

		await this.userAuthStateService.resetFailedLoginAttempts(user.id);

		const { password: _, ...safeUser } = user;

		return safeUser;
	}

	async update(input: UpdateUserProfileInput) {
		await this.prismaService.user.update({
			where: { id: input.userId },
			data: {
				userProfile: {
					update: {
						firstName: input.firstName,
						lastName: input.lastName,
					},
				},
			},
			select: this.buildSelect(),
		});
	}

	async updatePassword(id: string, input: UpdatePasswordInput) {
		const user = await this.findOne(id);

		if (!user) throw new BadRequestException("common.message.tryAgain");

		if (user.password && !input.skipOldPassword) {
			if (!input.oldPassword) throw new BadRequestException("common.message.tryAgain");

			const oldPasswordMatched = await verify(user.password, input.oldPassword);
			if (!oldPasswordMatched) throw new BadRequestException("common.message.tryAgain");
		}

		const hashedPassword = await hash(input.newPassword);

		await this.prismaService.user.update({
			where: { id },
			data: {
				password: hashedPassword,
				passwordUpdatedAt: new Date(),
			},
		});
	}

	async disablePassword(id: string) {
		const user = await this.findOne(id);

		if (!user) throw new BadRequestException("common.message.tryAgain");

		await this.prismaService.user.update({
			where: { id },
			data: {
				password: null,
				passwordUpdatedAt: new Date(),
			},
		});
	}

	async linkGoogle(input: LinkGoogleInput) {
		const user = await this.findOneByGoogleSub(input.googleSub);

		if (user && user.id !== input.userId) {
			throw new BadRequestException("common.message.tryAgain");
		}

		await this.prismaService.user.update({
			where: { id: input.userId },
			data: { googleSub: input.googleSub },
		});
	}

	async updateEmail(input: UpdateEmailInput) {
		const user = await this.findOne(input.userId);

		if (!user) throw new BadRequestException("common.message.tryAgain");

		await this.prismaService.user.update({
			where: { id: user.id },
			data: {
				email: input.email,
				emailUpdatedAt: new Date(),
				emailVerifiedAt: null,
			},
		});
	}

	async verifyEmail(userId: string) {
		const user = await this.findOne(userId);

		if (!user) throw new BadRequestException("common.message.tryAgain");

		await this.prismaService.user.update({
			where: { id: user.id },
			data: {
				emailVerifiedAt: new Date(),
			},
		});
	}
}
