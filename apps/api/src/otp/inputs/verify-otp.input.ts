import { OtpType } from "../../generated/prisma/enums";

export interface VerifyOtpInput {
	email: string;
	code: string;
	type: OtpType;
}
