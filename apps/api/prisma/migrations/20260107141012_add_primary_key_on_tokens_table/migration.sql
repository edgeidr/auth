/*
  Warnings:

  - The primary key for the `tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,type]` on the table `tokens` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `tokens` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "tokens_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_userId_type_key" ON "tokens"("userId", "type");
