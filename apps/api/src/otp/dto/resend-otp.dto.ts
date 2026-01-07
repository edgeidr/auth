import { IsNotEmpty } from "class-validator";

export class ResendOtpDto {
	@IsNotEmpty({ message: "common.validation.required" })
	token: string;
}
