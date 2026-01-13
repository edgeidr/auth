import { IsEmail, IsNotEmpty } from "class-validator";

export class AddEmailDto {
	@IsEmail({}, { message: "common.validation.invalidEmail" })
	email: string;

	@IsNotEmpty({ message: "common.validation.required" })
	tokenId: string;

	@IsNotEmpty({ message: "common.validation.required" })
	token: string;
}
