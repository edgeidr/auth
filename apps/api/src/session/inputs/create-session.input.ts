export interface CreateSessionInput {
	userId: string;
	refreshToken: {
		value: string;
		expiresAt: Date | string;
	};
}
