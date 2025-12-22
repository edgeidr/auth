import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { OAuthProfile } from "../types/oauth-profile";

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

	validate(_accessToken: string, _refreshToken: string, profile: Profile): OAuthProfile {
		const { id, emails, photos, name } = profile;
		const email = emails?.find((item) => item.verified)?.value ?? null;
		const firstName = name?.givenName ?? "";
		const lastName = name?.familyName ?? "";
		const photoUrl = photos?.[0].value ?? null;

		if (!email) throw new UnauthorizedException("common.message.emailUnverified");

		return {
			id,
			email,
			firstName,
			lastName,
			photoUrl,
		};
	}
}
