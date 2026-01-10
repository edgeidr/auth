import { Prisma } from "../../src/generated/prisma/client";

export const userSelect = <Prisma.UserSelect>{
	id: true,
	publicId: true,
	passwordChangedAt: true,
	email: true,
	isActive: true,
};
