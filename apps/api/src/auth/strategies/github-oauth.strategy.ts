import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-github2";
import { UserService } from "../../user/user.service";

@Injectable()
export class GithubOauthStrategy extends PassportStrategy(Strategy, "github") {
	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService,
	) {
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

	async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
		const { id, displayName, photos } = profile;
		const safeName = displayName?.trim() ?? "";
		const [first, ...last] = safeName.split(/\s+/);
		const firstName = first || "New";
		const lastName = last.length ? last.join(" ") : "User";
		const photoUrl = photos?.[0].value ?? null;

		let user = await this.userService.findOneByGithubId(id);

		if (!user) {
			user = await this.userService.create({
				firstName,
				lastName,
				photoUrl: photoUrl ?? undefined,
				githubId: id,
			});
		}

		return { userId: user.id };
	}
}
