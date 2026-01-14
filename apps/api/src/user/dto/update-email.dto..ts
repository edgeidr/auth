import { IsEmail, IsNotEmpty } from "class-validator";

export class UpdateEmailDto {
	@IsEmail({}, { message: "common.validation.invalidEmail" })
	email: string;

	@IsNotEmpty({ message: "common.validation.required" })
	tokenId: string;

	@IsNotEmpty({ message: "common.validation.required" })
	token: string;
}
