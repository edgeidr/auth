import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { OtpType } from "../../generated/prisma/enums";

export class VerifyOtpDto {
	@IsEmail({}, { message: "common.validation.invalidEmail" })
	email: string;

	@IsNotEmpty({ message: "validation.required" })
	code: string;

	@IsEnum(OtpType)
	type: OtpType;
}
