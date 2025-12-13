import { Injectable } from "@nestjs/common";
import { GenerateAccessTokenInput } from "./inputs/generate-access-token.input";
import { GenerateRefreshTokenInput } from "./inputs/generate-refresh-token.input";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { GenerateAuthTokensInput } from "./inputs/generate-auth-tokens.input";

@Injectable()
export class TokenService {
	constructor(
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
	) {}

	async generateAuthTokens(input: GenerateAuthTokensInput) {
		const uuid = randomUUID();
		const accessToken = await this.generateAccessToken({
			uuid,
			userId: input.userId,
		});
		const refreshToken = await this.generateRefreshToken({
			uuid,
			userId: input.userId,
			rememberMe: input.rememberMe,
		});

		return { accessToken, refreshToken };
	}

	async generateAccessToken(input: GenerateAccessTokenInput) {
		const duration = this.configService.get<number>("ACCESS_TOKEN_DURATION_IN_MINUTES", 60);
		const totalDuration = duration * 1000 * 60;
		const expiration = new Date(Date.now() + totalDuration);
		const payload = {
			sub: input.uuid,
			userId: input.userId,
		};

		const accessToken = await this.jwtService.signAsync(payload, {
			secret: this.configService.get<string>("JWT_ACCESS_TOKEN_SECRET", ""),
			expiresIn: `${duration}m`,
		});

		return {
			value: accessToken,
			expiresAt: expiration,
			totalDuration: totalDuration,
		};
	}

	async generateRefreshToken(input: GenerateRefreshTokenInput) {
		const duration = input.rememberMe
			? this.configService.get<number>("REFRESH_TOKEN_DURATION_LONG_IN_MINUTES", 1440)
			: this.configService.get<number>("REFRESH_TOKEN_DURATION_IN_MINUTES", 10080);
		const totalDuration = duration * 1000 * 60;
		const expiration = new Date(Date.now() + totalDuration);
		const payload = {
			sub: input.uuid,
			userId: input.userId,
		};

		const refreshToken = await this.jwtService.signAsync(payload, {
			secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET", ""),
		});

		return {
			value: refreshToken,
			expiresAt: expiration,
			totalDuration: totalDuration,
		};
	}
}
