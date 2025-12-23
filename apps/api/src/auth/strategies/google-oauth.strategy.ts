import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { UserService } from "../../user/user.service";

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, "google") {
	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService,
	) {
		super({
			clientID: configService.get<string>("GOOGLE_CLIENT_ID")!,
			clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET")!,
			callbackURL: configService.get<string>("GOOGLE_CALLBACK_URL"),
			scope: ["email", "profile"],
		});
	}

	async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
		const { id, emails, photos, name } = profile;
		const email = emails?.find((item) => item.verified)?.value ?? null;
		const firstName = name?.givenName ?? "New";
		const lastName = name?.familyName ?? "User";
		const photoUrl = photos?.[0].value ?? null;

		if (!email) {
			return { error: "common.message.emailUnverified" };
		}

		let user = await this.userService.findOneByGoogleSub(id);

		if (!user) {
			user = await this.userService.findOneByEmail(email);

			if (!user) {
				user = await this.userService.create({
					email,
					firstName,
					lastName,
					photoUrl: photoUrl ?? undefined,
					googleSub: id,
				});
			} else {
				return {
					error: "common.message.emailInUse",
					provider: "Google",
				};
			}
		}

		return { userId: user.id };
	}
}
