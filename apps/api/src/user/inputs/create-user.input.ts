export interface CreateUserInput {
	email?: string;
	password?: string;
	firstName: string;
	lastName: string;
	photoUrl?: string;
	googleSub?: string;
	githubId?: string;
}
