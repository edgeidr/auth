/*
  Warnings:

  - You are about to drop the column `slug` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[publicId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - The required column `publicId` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "users_slug_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "slug",
ADD COLUMN     "publicId" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_publicId_key" ON "users"("publicId");
