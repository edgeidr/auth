import { Module } from "@nestjs/common";
import { TokenService } from "./token.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtAccessStrategy, JwtRefreshStrategy } from "../jwt/jwt.strategy";
import { SessionModule } from "../session/session.module";

@Module({
	providers: [TokenService, JwtAccessStrategy, JwtRefreshStrategy],
	exports: [TokenService],
	imports: [JwtModule.register({}), SessionModule],
})
export class TokenModule {}
