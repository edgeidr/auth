import { IsNotEmpty } from "class-validator";

export class UpdateMyProfileDto {
	@IsNotEmpty({ message: "common.validation.required" })
	firstName: string;

	@IsNotEmpty({ message: "common.validation.required" })
	lastName: string;
}
