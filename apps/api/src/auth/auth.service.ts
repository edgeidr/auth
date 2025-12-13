import { Injectable } from "@nestjs/common";
import { LoginInput } from "./inputs/login.input";
import { UserService } from "../user/user.service";
import { SessionService } from "../session/session.service";
import { TokenService } from "../token/token.service";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly sessionService: SessionService,
		private readonly tokenService: TokenService,
	) {}

	async login(input: LoginInput) {
		const user = await this.userService.validateCredentials({
			email: input.email,
			password: input.password,
		});

		const { accessToken, refreshToken } = await this.tokenService.generateAuthTokens({
			userId: user.id,
			rememberMe: input.rememberMe,
		});

		const session = await this.sessionService.create({
			userId: user.id,
			refreshToken: {
				value: refreshToken.value,
				expiresAt: refreshToken.expiresAt,
			},
		});

		return { accessToken, refreshToken, sessionId: session.id };
	}
}
