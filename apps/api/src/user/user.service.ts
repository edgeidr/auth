import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ValidateCredentialsInput } from "./inputs/validate-credentials.input";
import { FindUserOptions } from "./types/find-user-options";
import { PrismaService } from "../prisma/prisma.service";
import { hash, verify } from "argon2";
import { UserAuthStateService } from "../user-auth-state/user-auth-state.service";
import { CreateUserInput } from "./inputs/create-user.input";
import { userSelect } from "../../prisma/selects/user.select";
import { userProfileSelect } from "../../prisma/selects/user-profile.select";
import { UpdateUserInput } from "./inputs/update-user.input";
import { UpdateGoogleProfileInput } from "./inputs/update-google-profile.input";
import { Prisma } from "../generated/prisma/client";
import { UpdatePasswordInput } from "./inputs/update-password.input";

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
				password: input.password ? await hash(input.password) : null,
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

		if (!user.password) {
			if (user.googleSub || user.githubId) {
				throw new UnauthorizedException("common.message.socialOnlyAccount");
			} else {
				throw new UnauthorizedException("common.message.loginFailed");
			}
		}

		const isAccountLocked = await this.userAuthStateService.isAccountLocked(user.id);
		if (isAccountLocked) throw new UnauthorizedException("common.message.accountLocked");

		const passwordMatches = await verify(user.password, input.password);

		if (!passwordMatches) {
			await this.userAuthStateService.incrementFailedLoginAttempts(user.id);
			throw new UnauthorizedException("common.message.invalidCredentials");
		}

		await this.userAuthStateService.resetFailedLoginAttempts(user.id);

		const { password: _, ...safeUser } = user;

		return safeUser;
	}

	async update(id: string, input: UpdateUserInput, options: FindUserOptions = {}) {
		await this.prismaService.user.update({
			where: { id },
			data: {
				userProfile: {
					update: {
						firstName: input.firstName,
						lastName: input.lastName,
					},
				},
			},
			select: this.buildSelect(options),
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
			data: { password: hashedPassword },
		});
	}

	async updateGoogleProfile(
		id: string,
		input: UpdateGoogleProfileInput,
		options: FindUserOptions = {},
	) {
		const user = await this.findOne(id);
		const updateData: Prisma.UserUpdateInput = {
			googleSub: input.googleSub,
		};

		if (!user?.userProfile?.photoUrl && input.photoUrl) {
			updateData.userProfile = {
				update: {
					photoUrl: input.photoUrl,
				},
			};
		}

		await this.prismaService.user.update({
			where: { id },
			data: updateData,
			select: this.buildSelect(options),
		});
	}
}
