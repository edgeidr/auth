export interface CreateUserInput {
	email?: string;
	emailVerifiedAt?: Date;
	emailUpdatedAt?: Date;
	password?: string;
	firstName: string;
	lastName: string;
	photoUrl?: string;
	googleSub?: string;
	githubId?: string;
}
