import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";
import { Match } from "../../common/decorators/match.decorator";

export class ResetPasswordDto {
	@IsEmail({}, { message: "common.validation.invalidEmail" })
	email: string;

	@IsNotEmpty({ message: "common.validation.required" })
	token: string;

	@IsNotEmpty({ message: "common.validation.required" })
	@IsStrongPassword({}, { message: "common.validation.invalidPassword" })
	newPassword: string;

	@Match("newPassword", { message: "common.validation.passwordMismatch" })
	confirmNewPassword: string;
}
