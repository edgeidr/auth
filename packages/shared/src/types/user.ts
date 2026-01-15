export interface User {
	id: string;
	email: string;
	emailVerifiedAt?: Date;
	emailUpdatedAt?: Date;
	publicId: string;
	passwordEnabled: boolean;
	passwordUpdatedAt?: Date;
	isActive: boolean;
	userProfile?: UserProfile;
	githubId: boolean;
	googleSub: boolean;
}

export interface UserProfile {
	firstName: string;
	lastName: string;
	photoUrl: string;
}
