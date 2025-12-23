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
	register(@Body() registerDto: RegisterDto) {
		const payload: RegisterInput = {
			firstName: registerDto.firstName,
			lastName: registerDto.lastName,
			email: registerDto.email,
			password: registerDto.password,
		};

		return this.authService.register(payload);
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
