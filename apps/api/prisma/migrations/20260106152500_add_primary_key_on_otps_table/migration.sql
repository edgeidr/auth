/*
  Warnings:

  - The primary key for the `otps` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,type]` on the table `otps` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `otps` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "otps" DROP CONSTRAINT "otps_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "otps_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "otps_userId_type_key" ON "otps"("userId", "type");
