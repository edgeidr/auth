import { Module } from "@nestjs/common";
import { TokenService } from "./token.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtAccessStrategy, JwtRefreshStrategy } from "../jwt/jwt.strategy";

@Module({
	providers: [TokenService, JwtAccessStrategy, JwtRefreshStrategy],
	exports: [TokenService],
	imports: [JwtModule.register({})],
})
export class TokenModule {}
