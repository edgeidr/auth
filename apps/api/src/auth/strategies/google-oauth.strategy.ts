import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, "google") {
	constructor(private readonly configService: ConfigService) {
		super({
			clientID: configService.get<string>("GOOGLE_CLIENT_ID")!,
			clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET")!,
			callbackURL: configService.get<string>("GOOGLE_CALLBACK_URL"),
			scope: ["email", "profile"],
		});
	}

	authorizationParams() {
		return { prompt: "select_account" };
	}

	validate(_accessToken: string, _refreshToken: string, profile: Profile) {
		return { profile };
	}
}
