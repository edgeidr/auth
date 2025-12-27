import { OtpType } from "../../generated/prisma/enums";

export interface OtpAttemptInput {
	userId: string;
	type: OtpType;
}
