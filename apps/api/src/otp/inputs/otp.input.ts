import { OtpType } from "../../generated/prisma/enums";

export interface OtpInput {
	userId: string;
	type: OtpType;
}
