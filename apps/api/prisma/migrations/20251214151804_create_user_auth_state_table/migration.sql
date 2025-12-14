-- CreateTable
CREATE TABLE "user_auth_states" (
    "userId" TEXT NOT NULL,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_auth_states_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "user_auth_states" ADD CONSTRAINT "user_auth_states_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
