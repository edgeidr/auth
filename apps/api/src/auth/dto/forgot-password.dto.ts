import { IsEmail } from "class-validator";

export class ForgotPasswordDto {
	@IsEmail({}, { message: "common.validation.invalidEmail" })
	email: string;
}
