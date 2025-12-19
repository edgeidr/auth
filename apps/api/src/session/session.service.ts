import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSessionInput } from "./inputs/create-session.input";
import { FindSessionInput } from "./inputs/find-session.input";
import { RemoveSessionInput } from "./inputs/remove-session.input";
import { UpdateSessionInput } from "./inputs/update-session.input";

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

	update(input: UpdateSessionInput) {
		return this.prismaService.session.update({
			where: {
				id: input.sessionId,
				userId: input.userId,
			},
			data: {
				refreshToken: {
					update: { value: input.refreshToken },
				},
			},
			include: { refreshToken: true },
		});
	}

	async remove(input: RemoveSessionInput) {
		await this.prismaService.session.deleteMany({
			where: {
				id: input.sessionId,
				userId: input.sessionId,
			},
		});
	}
}
