/*
  Warnings:

  - You are about to drop the `UserAction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserAction" DROP CONSTRAINT "UserAction_actionId_fkey";

-- DropTable
DROP TABLE "UserAction";

-- CreateTable
CREATE TABLE "user_actions" (
    "userId" TEXT NOT NULL,
    "actionId" INTEGER NOT NULL,
    "scope" "ActionScope" NOT NULL,

    CONSTRAINT "user_actions_pkey" PRIMARY KEY ("userId","actionId")
);

-- AddForeignKey
ALTER TABLE "user_actions" ADD CONSTRAINT "user_actions_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "actions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
