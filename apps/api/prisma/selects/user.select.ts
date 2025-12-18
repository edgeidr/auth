import { Prisma } from "@prisma/client";

export const userSelect = Prisma.validator<Prisma.UserSelect>()({
	id: true,
	email: true,
	slug: true,
	isActive: true,
});
