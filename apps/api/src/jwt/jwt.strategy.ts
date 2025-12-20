import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { SessionService } from "../session/session.service";

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

		return { userId: payload.userId };
	}
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
	constructor(
		private readonly configService: ConfigService,
		private readonly sessionService: SessionService,
	) {
		super({
			jwtFromRequest: (req: Request) => <string>req.cookies["refreshToken"] || null,
			secretOrKey: configService.get<string>("JWT_REFRESH_TOKEN_SECRET")!,
			passReqToCallback: true,
		});
	}

	async validate(request: Request, payload: { sub: string; userId: string }) {
		const sessionId = <string>request.cookies["sessionId"] || null;
		const refreshToken = <string>request.cookies["refreshToken"] || null;

		if (!sessionId || !refreshToken) {
			throw new UnauthorizedException("common.message.tokenExpired");
		}

		const session = await this.sessionService.findOne({
			sessionId,
			userId: payload.userId,
			refreshToken,
		});

		if (!session) throw new UnauthorizedException("common.message.tokenExpired");

		return { userId: payload.userId };
	}
}
