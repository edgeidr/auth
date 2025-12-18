import { Prisma } from "@prisma/client";

export const userProfileSelect = Prisma.validator<Prisma.UserProfileSelect>()({
	firstName: true,
	lastName: true,
	photoUrl: true,
});
