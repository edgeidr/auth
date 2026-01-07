import { BadRequestException, Injectable } from "@nestjs/common";
import { GenerateAccessTokenInput } from "./inputs/generate-access-token.input";
import { GenerateRefreshTokenInput } from "./inputs/generate-refresh-token.input";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { GenerateAuthTokensInput } from "./inputs/generate-auth-tokens.input";
import { TokenInput } from "./inputs/token.input";
import { PrismaService } from "../prisma/prisma.service";
import { hash, verify } from "argon2";
import { VerifyTokenInput } from "./inputs/verify-token.input";

@Injectable()
export class TokenService {
	private readonly TOKEN_DURATION: number;

	constructor(
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly prismaService: PrismaService,
	) {
		this.TOKEN_DURATION = configService.get<number>("TOKEN_DURATION_IN_MINUTES", 5) * 1000 * 60;
	}

	async reissue(input: TokenInput) {
		await this.remove(input);
		return this.create(input);
	}

	async verifyOrThrow(input: VerifyTokenInput) {
		const token = await this.prismaService.token.findUnique({
			where: { id: input.id },
		});

		if (!token || !(await verify(token.value, input.value))) {
			throw new BadRequestException("common.message.tryAgain");
		}

		return token;
	}

	async create(input: TokenInput) {
		const tokenValue = randomUUID();
		const hashedTokenValue = await hash(tokenValue);
		const expiresAt = new Date(Date.now() + this.TOKEN_DURATION);

		const token = await this.prismaService.token.create({
			data: {
				userId: input.userId,
				type: input.type,
				value: hashedTokenValue,
				expiresAt,
			},
			select: { id: true },
		});

		return { tokenId: token.id, token: tokenValue };
	}

	async remove(input: TokenInput) {
		await this.prismaService.token.deleteMany({
			where: {
				userId: input.userId,
				type: input.type,
			},
		});
	}

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
