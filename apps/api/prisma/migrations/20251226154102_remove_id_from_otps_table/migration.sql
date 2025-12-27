/*
  Warnings:

  - The primary key for the `otps` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `otps` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "otps_userId_type_idx";

-- AlterTable
ALTER TABLE "otps" DROP CONSTRAINT "otps_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "otps_pkey" PRIMARY KEY ("userId", "type");
