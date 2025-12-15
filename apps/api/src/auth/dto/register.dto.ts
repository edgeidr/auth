import { Equals, IsBoolean, IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";
import { Match } from "../../common/decorators/match.decorator";

export class RegisterDto {
	@IsNotEmpty({ message: "common.validation.required" })
	firstName: string;

	@IsNotEmpty({ message: "common.validation.required" })
	lastName: string;

	@IsEmail({}, { message: "common.validation.invalidEmail" })
	email: string;

	@IsNotEmpty({ message: "common.validation.required" })
	@IsStrongPassword({}, { message: "common.validation.invalidPassword" })
	password: string;

	@Match("password", { message: "common.validation.passwordMismatch" })
	confirmPassword: string;

	@IsBoolean()
	@Equals(true, { message: "common.validation.termsAgreementRequired" })
	agreement: boolean;
}
