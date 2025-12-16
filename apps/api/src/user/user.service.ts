import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ValidateCredentialsInput } from "./inputs/validate-credentials.input";
import { FindUserOptions } from "./types/find-user-options";
import { PrismaService } from "../prisma/prisma.service";
import { hash, verify } from "argon2";
import { UserAuthStateService } from "../user-auth-state/user-auth-state.service";
import { CreateUserInput } from "./inputs/create-user.input";

@Injectable()
export class UserService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly userAuthStateService: UserAuthStateService,
	) {}

	async create(input: CreateUserInput) {
		return this.prismaService.user.create({
			data: {
				email: input.email,
				password: await hash(input.password),
				userProfile: {
					create: {
						firstName: input.firstName,
						lastName: input.lastName,
					},
				},
			},
		});
	}

	async findOneByEmail(email: string, options: FindUserOptions = {}) {
		const user = await this.prismaService.user.findFirst({
			where: {
				email,
				isActive: options.include?.inactive ? undefined : true,
			},
			omit: { password: !options.include?.password },
		});

		return user;
	}

	async validateCredentials(input: ValidateCredentialsInput) {
		const user = await this.findOneByEmail(input.email, { include: { password: true } });
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
}
