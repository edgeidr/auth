import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { SessionModule } from "../session/session.module";
import { TokenModule } from "../token/token.module";
import { GoogleOauthStrategy } from "./strategies/google-oauth.strategy";
import { GithubOauthStrategy } from "./strategies/github-oauth.strategy";

@Module({
	controllers: [AuthController],
	providers: [AuthService, GoogleOauthStrategy, GithubOauthStrategy],
	imports: [UserModule, SessionModule, TokenModule],
})
export class AuthModule {}
