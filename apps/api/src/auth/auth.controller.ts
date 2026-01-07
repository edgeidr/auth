import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res,
	UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { CookieOptions, Request, Response } from "express";
import { LoginInput } from "./inputs/login.input";
import { ConfigService } from "@nestjs/config";
import { RegisterInput } from "./inputs/register.input";
import { RegisterDto } from "./dto/register.dto";
import { JwtAccessGuard, JwtRefreshGuard } from "../jwt/jwt.guard";
import { GoogleOauthGuard } from "./guards/google-oauth.guard";
import { GithubOauthGuard } from "./guards/github-oauth.guard";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ResetPasswordInput } from "./inputs/reset-password.input";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Post("login")
	async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
		const payload: LoginInput = {
			email: loginDto.email,
			password: loginDto.password,
			rememberMe: loginDto.rememberMe,
		};

		const { accessToken, refreshToken, sessionId } = await this.authService.login(payload);

		response.cookie("isLoggedIn", true, this.getCookieOptions({ httpOnly: false }));
		response.cookie(
			"sessionId",
			sessionId,
			this.getCookieOptions({ maxAge: refreshToken.totalDuration }),
		);
		response.cookie(
			"accessToken",
			accessToken.value,
			this.getCookieOptions({ maxAge: accessToken.totalDuration }),
		);
		response.cookie(
			"refreshToken",
			refreshToken.value,
			this.getCookieOptions({ maxAge: refreshToken.totalDuration }),
		);
	}

	@Post("register")
	async register(@Body() registerDto: RegisterDto) {
		const payload: RegisterInput = {
			firstName: registerDto.firstName,
			lastName: registerDto.lastName,
			email: registerDto.email,
			password: registerDto.password,
		};

		await this.authService.register(payload);

		return { message: "common.message.registrationSuccess" };
	}

	@UseGuards(JwtAccessGuard)
	@Get("me")
	async getMe(@Req() request: Request) {
		const { userId } = request.user as { userId: string };
		return this.authService.getMe(userId);
	}

	@UseGuards(JwtAccessGuard)
	@Post("logout")
	async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
		const { userId } = request.user as { userId: string };
		const sessionId = request.cookies?.["sessionId"] as string | null;

		if (sessionId && userId) await this.authService.logout({ sessionId, userId });

		response.clearCookie("isLoggedIn", this.getCookieOptions({ httpOnly: false }));
		response.clearCookie("refreshToken", this.getCookieOptions());
		response.clearCookie("accessToken", this.getCookieOptions());
		response.clearCookie("sessionId", this.getCookieOptions());
	}

	@UseGuards(JwtRefreshGuard)
	@Post("refresh")
	async rotateTokens(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
		const sessionId = <string>request.cookies["sessionId"];
		const { userId } = request.user as { userId: string };

		const { refreshToken, accessToken } = await this.authService.rotateTokens({
			sessionId,
			userId,
		});

		response.cookie(
			"refreshToken",
			refreshToken.value,
			this.getCookieOptions({ maxAge: refreshToken.totalDuration }),
		);
		response.cookie(
			"accessToken",
			accessToken.value,
			this.getCookieOptions({ maxAge: accessToken.totalDuration }),
		);
	}

	@UseGuards(GoogleOauthGuard)
	@Get("google")
	googleLogin() {}

	@UseGuards(GoogleOauthGuard)
	@Get("google/callback")
	async googleCallback(@Req() request: Request, @Res() response: Response) {
		const redirectUrl = this.configService.get<string>("OAUTH_REDIRECT_URL")!;
		const { error, provider, userId } = request.user as {
			error?: string;
			provider?: string;
			userId: string;
		};

		if (error) {
			if (provider) {
				return response.redirect(`${redirectUrl}?error=${error}&provider=${provider}`);
			}

			return response.redirect(`${redirectUrl}?error=${error}`);
		}

		const { accessToken, refreshToken, sessionId } = await this.authService.socialLogin(userId);

		response.cookie("isLoggedIn", true, this.getCookieOptions({ httpOnly: false }));
		response.cookie(
			"sessionId",
			sessionId,
			this.getCookieOptions({ maxAge: refreshToken.totalDuration }),
		);
		response.cookie(
			"accessToken",
			accessToken.value,
			this.getCookieOptions({ maxAge: accessToken.totalDuration }),
		);
		response.cookie(
			"refreshToken",
			refreshToken.value,
			this.getCookieOptions({ maxAge: refreshToken.totalDuration }),
		);

		return response.redirect(redirectUrl);
	}

	@UseGuards(GithubOauthGuard)
	@Get("github")
	githubLogin() {}

	@UseGuards(GithubOauthGuard)
	@Get("github/callback")
	async githubCallback(@Req() request: Request, @Res() response: Response) {
		const redirectUrl = this.configService.get<string>("OAUTH_REDIRECT_URL")!;
		const { userId } = request.user as { userId: string };
		const { accessToken, refreshToken, sessionId } = await this.authService.socialLogin(userId);

		response.cookie("isLoggedIn", true, this.getCookieOptions({ httpOnly: false }));
		response.cookie(
			"sessionId",
			sessionId,
			this.getCookieOptions({ maxAge: refreshToken.totalDuration }),
		);
		response.cookie(
			"accessToken",
			accessToken.value,
			this.getCookieOptions({ maxAge: accessToken.totalDuration }),
		);
		response.cookie(
			"refreshToken",
			refreshToken.value,
			this.getCookieOptions({ maxAge: refreshToken.totalDuration }),
		);

		return response.redirect(redirectUrl);
	}

	@Post("forgot-password")
	forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
		return this.authService.forgotPassword(forgotPasswordDto.email);
	}

	@Post("reset-password")
	async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
		const payload: ResetPasswordInput = {
			tokenId: resetPasswordDto.tokenId,
			token: resetPasswordDto.token,
			newPassword: resetPasswordDto.newPassword,
		};

		await this.authService.resetPassword(payload);

		return { message: "common.message.passwordResetSuccess" };
	}

	@UseGuards(JwtAccessGuard)
	@Post("password/change/request")
	async requestPasswordReset(@Req() request: Request) {
		const { userId } = request.user as { userId: string };

		return this.authService.requestPasswordReset(userId);
	}

	private getCookieOptions(options: { maxAge?: number; httpOnly?: boolean } = {}): CookieOptions {
		const secureEnvironments = ["production", "staging"];
		const useSecure = secureEnvironments.includes(
			this.configService.get<string>("NODE_ENV", "development"),
		);
		const baseDomain = useSecure ? this.configService.get<string>("COOKIE_DOMAIN") : undefined;

		return {
			httpOnly: options.httpOnly ?? true,
			sameSite: "strict",
			secure: useSecure,
			domain: baseDomain,
			path: "/",
			maxAge: options.maxAge,
		};
	}
}
