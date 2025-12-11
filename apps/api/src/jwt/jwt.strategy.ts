import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, "jwt-access") {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: (req: Request) => <string>req.cookies["accessToken"] || null,
			secretOrKey: configService.get<string>("JWT_ACCESS_TOKEN_SECRET")!,
		});
	}

	validate(payload: { sub: string; userId: string }) {
		if (!payload.sub || !payload.userId) throw new UnauthorizedException();

		return { id: payload.userId };
	}
}

export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
	constructor(
		private readonly configService: ConfigService,
		private readonly prismaService: PrismaService,
	) {
		super({
			jwtFromRequest: (req: Request) => <string>req.cookies["refreshToken"] || null,
			secretOrKey: configService.get<string>("JWT_REFRESH_TOKEN_SECRET")!,
			passReqToCallback: true,
		});
	}

	validate(request: Request, payload: { sub: string; userId: string }) {
		const sessionId = <string>request.cookies["sessionId"];
		const refreshToken = <string>request.cookies["refreshToken"];
	}
}
