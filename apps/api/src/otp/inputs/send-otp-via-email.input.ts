import { OtpType } from "../../generated/prisma/enums";

export interface SendOtpViaEmailInput {
	email: string;
	type: OtpType;
}
