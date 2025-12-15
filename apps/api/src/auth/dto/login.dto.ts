import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class LoginDto {
	@IsEmail({}, { message: "common.validation.invalidEmail" })
	email: string;

	@IsNotEmpty({ message: "common.validation.required" })
	password: string;

	@IsOptional()
	@IsBoolean()
	rememberMe: boolean = false;
}
