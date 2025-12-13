import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class LoginDto {
	@IsEmail({}, { message: "validations.invalidEmail" })
	email: string;

	@IsNotEmpty({ message: "validations.required" })
	password: string;

	@IsOptional()
	@IsBoolean()
	rememberMe: boolean = false;
}
