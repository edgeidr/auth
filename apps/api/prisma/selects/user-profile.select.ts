import { Prisma } from "../../src/generated/prisma/client";

export const userProfileSelect = <Prisma.UserProfileSelect>{
	firstName: true,
	lastName: true,
	photoUrl: true,
};
