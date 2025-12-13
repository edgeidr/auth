import { Body, Controller, HttpCode, HttpStatus, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { CookieOptions, Response } from "express";
import { LoginInput } from "./inputs/login.input";
import { ConfigService } from "@nestjs/config";

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
