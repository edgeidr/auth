import { IsNotEmpty } from "class-validator";

export class VerifyOtpDto {
	@IsNotEmpty({ message: "common.validation.required" })
	token: string;

	@IsNotEmpty({ message: "common.validation.required" })
	code: string;
}
