/*
  Warnings:

  - You are about to drop the column `profileId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `user_profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `user_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_profileId_fkey";

-- DropIndex
DROP INDEX "users_profileId_key";

-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "profileId";

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "user_profiles"("userId");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
