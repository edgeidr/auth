export interface FindUserOptions {
	include?: {
		password?: boolean;
		inactive?: boolean;
		userProfile?: boolean;
		googleSub?: boolean;
		githubId?: boolean;
	};
}
