import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { FindSessionInput } from "./inputs/find-session.input";

@Injectable()
export class TokenService {
	constructor(private readonly prismaService: PrismaService) {}

	findSession(input: FindSessionInput) {
		return this.prismaService.session.findUnique({
			where: {
				id: input.sessionId,
				refreshToken: {
					value: input.refreshToken,
					expiresAt: { gte: new Date() },
				},
				user: {
					id: input.userId,
					isActive: true,
				},
			},
		});
	}
}
