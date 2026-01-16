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

	async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
		return { profile };
		const { id: googleSub, emails, photos, name } = profile;
		const email = emails?.find((item) => item.verified)?.value ?? null;
		const firstName = name?.givenName ?? "New";
		const lastName = name?.familyName ?? "User";
		const photoUrl = photos?.[0].value ?? undefined;

		if (!email) return { error: "common.message.noVerifiedEmail" };

		let user = await this.userService.findOneByGoogleSub(googleSub, {
			scope: { inactive: true },
		});

		if (!user) {
			user = await this.userService.findOneByEmail(email, {
				scope: { unverifiedEmail: true, inactive: true },
			});

			if (!user) {
				const now = new Date();

				user = await this.userService.create({
					email,
					emailUpdatedAt: now,
					emailVerifiedAt: now,
					firstName,
					lastName,
					photoUrl,
					googleSub,
				});
			} else {
				if (!user.isActive) return { error: "common.message.accountInactive" };

				return { error: "common.message.googleAccountNotLinked" };
			}
		}

		if (!user.isActive) return { error: "common.message.accountInactive" };

		return { userId: user.id };
	}
}
