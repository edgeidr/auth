import { TokenType } from "../../generated/prisma/enums";

export interface TokenInput {
	userId: string;
	type: TokenType;
}
