import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ValidateCredentialsInput } from "./inputs/validate-credentials.input";
import { FindUserOptions } from "./types/find-user-options";
import { PrismaService } from "../prisma/prisma.service";
import { verify } from "argon2";

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {}

	async findOneByEmail(email: string, options: FindUserOptions = {}) {
		const user = await this.prismaService.user.findFirst({
			where: {
				email,
				isActive: true,
			},
			omit: { password: !options.includePassword },
		});

		return user;
	}

	async validateCredentials(input: ValidateCredentialsInput) {
		const user = await this.findOneByEmail(input.email, { includePassword: true });

		if (!user) throw new UnauthorizedException("messages.invalidCredentials");

		if (!user.password) {
			if (user.googleSub || user.githubId) {
				throw new UnauthorizedException("messages.socialOnlyAccount");
			} else {
				throw new UnauthorizedException("messages.loginFailed");
			}
		}

		const passwordMatches = await verify(user.password, input.password);

		if (!passwordMatches) throw new UnauthorizedException("messages.invalidCredentials");

		const { password: _, ...safeUser } = user;

		return safeUser;
	}
}
