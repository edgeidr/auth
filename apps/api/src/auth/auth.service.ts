import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { LoginInput } from "./inputs/login.input";
import { UserService } from "../user/user.service";
import { SessionService } from "../session/session.service";
import { TokenService } from "../token/token.service";
import { RegisterInput } from "./inputs/register.input";

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

	async register(input: RegisterInput) {
		const userExists = await this.userService.findOneByEmail(input.email, {
			include: { inactive: true },
		});

		if (userExists) {
			throw new ConflictException({
				message: [{ field: "email", error: ["common.validation.emailTaken"] }],
			});
		}

		const user = await this.userService.create({
			email: input.email,
			password: input.password,
			firstName: input.firstName,
			lastName: input.lastName,
		});

		if (!user) throw new InternalServerErrorException("common.message.tryAgain");

		return { message: "common.message.registrationSuccess" };
	}

	getMe(userId: string) {
		return this.userService.findOne(userId, {
			include: { userProfile: true },
		});
	}
}
