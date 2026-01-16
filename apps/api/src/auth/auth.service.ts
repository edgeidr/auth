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
import { Profile as GithubProfile } from "passport-github2";

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
			scope: { inactive: true, unverifiedEmail: true },
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
			with: {
				password: true,
				userProfile: true,
				authProviders: true,
			},
			scope: {
				unverifiedEmail: true,
			},
		});

		if (!user) throw new UnauthorizedException("common.message.accessDenied");

		const { password, ...userData } = user;

		return {
			...userData,
			passwordEnabled: !!password,
			googleSub: !!userData.googleSub,
			githubId: !!userData.githubId,
		};
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

		if (!session.refreshToken) throw new UnauthorizedException("common.message.sessionExpired");

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

	async loginWithGithub(profile: GithubProfile) {
		const { id: githubId, displayName, photos } = profile;
		const safeName = displayName?.trim() ?? "";
		const [first, ...last] = safeName.split(/\s+/);
		const firstName = first || "New";
		const lastName = last.length ? last.join(" ") : "User";
		const photoUrl = photos?.[0].value ?? undefined;

		let user = await this.userService.findOneByGithubId(githubId, {
			scope: { inactive: true },
		});

		if (!user) {
			user = await this.userService.create({
				firstName,
				lastName,
				photoUrl,
				githubId,
			});
		}

		if (!user.isActive) return { error: "common.message.accountInactive" };

		return this.socialLogin(user.id);
	}

	async requestPasswordChange(userId: string) {
		const user = await this.userService.findOne(userId);

		if (!user?.email) throw new BadRequestException("common.message.tryAgain");

		return this.otpService.sendViaEmail({
			email: user.email,
			type: OtpType.PASSWORD_RESET,
		});
	}

	async requestPasswordReset(email: string) {
		const user = await this.userService.findOneByEmail(email);

		if (!user?.email) throw new BadRequestException("common.message.tryAgain");

		return this.otpService.sendViaEmail({
			email: user.email,
			type: OtpType.PASSWORD_RESET,
		});
	}

	async requestPasswordDisable(userId: string) {
		const user = await this.userService.findOne(userId);

		if (!user?.email) throw new BadRequestException("common.message.tryAgain");

		return this.otpService.sendViaEmail({
			email: user.email,
			type: OtpType.PASSWORD_DISABLE,
		});
	}

	async requestEmailAddition(userId: string) {
		const user = await this.userService.findOne(userId);

		if (!user) throw new BadRequestException("common.message.tryAgain");

		return this.tokenService.reissue({
			type: TokenType.EMAIL_CHANGE,
			userId,
		});
	}

	async requestEmailVerification(userId: string) {
		const user = await this.userService.findOne(userId, {
			scope: { unverifiedEmail: true },
		});

		if (!user?.email) throw new BadRequestException("common.message.tryAgain");

		return this.otpService.sendViaEmail({
			email: user.email,
			type: OtpType.EMAIL_VERIFICATION,
		});
	}

	async requestEmailChange(userId: string) {
		const user = await this.userService.findOne(userId);

		if (!user?.email) throw new BadRequestException("common.message.tryAgain");

		return this.otpService.sendViaEmail({
			email: user.email,
			type: OtpType.EMAIL_CHANGE,
		});
	}
}
