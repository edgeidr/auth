import { TokenType } from "../../generated/prisma/enums";

export interface VerifyTokenInput {
	type: TokenType;
	value: string;
	userId: string;
}
