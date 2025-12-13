import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSessionInput } from "./inputs/create-session.input";
import { FindSessionInput } from "./inputs/find-session.input";

@Injectable()
export class SessionService {
	constructor(private readonly prismaService: PrismaService) {}

	findOne(input: FindSessionInput) {
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

	create(input: CreateSessionInput) {
		return this.prismaService.session.create({
			data: {
				userId: input.userId,
				refreshToken: {
					create: {
						value: input.refreshToken.value,
						expiresAt: input.refreshToken.expiresAt,
					},
				},
			},
		});
	}
}
