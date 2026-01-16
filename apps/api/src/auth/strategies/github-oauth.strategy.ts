import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-github2";

@Injectable()
export class GithubOauthStrategy extends PassportStrategy(Strategy, "github") {
	constructor(private readonly configService: ConfigService) {
		super({
			clientID: configService.get<string>("GITHUB_CLIENT_ID")!,
			clientSecret: configService.get<string>("GITHUB_CLIENT_SECRET")!,
			callbackURL: configService.get<string>("GITHUB_CALLBACK_URL")!,
			scope: ["read:user"],
		});
	}

	authorizationParams() {
		return { prompt: "select_account" };
	}

	validate(_accessToken: string, _refreshToken: string, profile: Profile) {
		return { profile };
	}
}
