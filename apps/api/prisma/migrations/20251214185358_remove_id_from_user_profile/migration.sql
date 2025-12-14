/*
  Warnings:

  - The primary key for the `user_profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user_profiles` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "user_profiles_userId_key";

-- AlterTable
ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("userId");
