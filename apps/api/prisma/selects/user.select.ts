import { Prisma } from "../../src/generated/prisma/client";

export const userSelect = <Prisma.UserSelect>{
	id: true,
	publicId: true,
	passwordUpdatedAt: true,
	email: true,
	emailVerifiedAt: true,
	emailUpdatedAt: true,
	isActive: true,
};
