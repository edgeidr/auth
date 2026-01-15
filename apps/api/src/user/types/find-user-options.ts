export interface FindUserOptions {
	with?: {
		password?: boolean;
		authProviders?: boolean;
		userProfile?: boolean;
	};
	scope?: {
		inactive?: boolean;
		unverifiedEmail?: boolean;
	};
}
