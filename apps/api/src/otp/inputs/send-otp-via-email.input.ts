import { OtpType } from "../../generated/prisma/enums";

export interface SendOtpViaEmailInput {
	subject: string;
	email: string;
	type: OtpType;
}
