import { IsEmail } from "class-validator";

export class PasswordResetRequestDto {
	@IsEmail({}, { message: "common.validation.invalidEmail" })
	email: string;
}
