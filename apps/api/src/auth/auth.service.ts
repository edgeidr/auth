import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from "@nestjs/common";
import { LoginInput } from "./inputs/login.input";
import { UserService } from "../user/user.service";
import { SessionService } from "../session/session.service";
import { TokenService } from "../token/token.service";
import { RegisterInput } from "./inputs/register.input";
import { LogoutInput } from "./inputs/logout.input";
import { RotateTokensInput } from "./inputs/rotate-tokens.input";
import { OtpService } from "../otp/otp.service";
import { OtpType, TokenType } from "../generated/prisma/enums";
import { ResetPasswordInput } from "./inputs/reset-password.input";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly sessionService: SessionService,
		private readonly tokenService: TokenService,
		private readonly otpService: OtpService,
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
	}

	async getMe(userId: string) {
		const user = await this.userService.findOne(userId, {
			include: { userProfile: true },
		});

		if (!user) throw new UnauthorizedException("common.message.accessDenied");

		return user;
	}

	async logout(input: LogoutInput) {
		await this.sessionService.remove(input);
	}

	async rotateTokens(input: RotateTokensInput) {
		const { refreshToken, accessToken } = await this.tokenService.generateAuthTokens({
			userId: input.userId,
			rememberMe: false,
		});

		const session = await this.sessionService.update({
			userId: input.userId,
			sessionId: input.sessionId,
			refreshToken: refreshToken.value,
		});

		if (!session.refreshToken) throw new UnauthorizedException("common.message.tokenExpired");

		return {
			accessToken,
			refreshToken: {
				value: session.refreshToken.value,
				expiresAt: session.refreshToken.expiresAt,
				totalDuration: session.refreshToken.expiresAt.getTime() - Date.now(),
			},
		};
	}

	async socialLogin(userId: string) {
		const { accessToken, refreshToken } = await this.tokenService.generateAuthTokens({
			userId,
			rememberMe: false,
		});

		const session = await this.sessionService.create({
			userId,
			refreshToken: {
				value: refreshToken.value,
				expiresAt: refreshToken.expiresAt,
			},
		});

		return { accessToken, refreshToken, sessionId: session.id };
	}

	async forgotPassword(email: string) {
		return this.otpService.sendViaEmail({
			subject: "Reset Your Password - OTP Verification",
			email,
			type: OtpType.FORGOT_PASSWORD,
		});
	}

	async resetPassword(input: ResetPasswordInput) {
		const user = await this.userService.findOneByEmail(input.email, {
			include: { password: true },
		});

		if (!user) throw new BadRequestException("common.message.tryAgain");

		await this.tokenService.verifyOrThrow({
			userId: user.id,
			value: input.token,
			type: TokenType.PASSWORD_RESET,
		});

		await this.userService.updatePassword(user.id, {
			newPassword: input.newPassword,
			skipOldPassword: true,
		});
	}
}
