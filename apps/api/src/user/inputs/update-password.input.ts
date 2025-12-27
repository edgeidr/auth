export interface UpdatePasswordInput {
	oldPassword?: string;
	newPassword: string;
	skipOldPassword?: boolean;
}
