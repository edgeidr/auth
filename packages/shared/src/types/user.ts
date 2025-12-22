export interface User {
	id: string;
	email: string;
	publicId: string;
	isActive: boolean;
	userProfile?: UserProfile;
}

export interface UserProfile {
	firstName: string;
	lastName: string;
	photoUrl: string;
}
