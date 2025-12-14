import { Equals, IsBoolean, IsEmail, IsNotEmpty } from "class-validator";
import { Match } from "../../common/decorators/match.decorator";

export class RegisterDto {
	@IsNotEmpty({ message: "validations.required" })
	firstName: string;

	@IsNotEmpty({ message: "validations.required" })
	lastName: string;

	@IsEmail({}, { message: "validations.invalidEmail" })
	email: string;

	@IsNotEmpty({ message: "validations.required" })
	password: string;

	@Match("password", { message: "validations.passwordMismatch" })
	confirmPassword: string;

	@IsBoolean()
	@Equals(true, { message: "validations.termsAgreementRequired" })
	agreement: boolean;
}
