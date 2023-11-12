-- DropForeignKey
ALTER TABLE "UserChecklists" DROP CONSTRAINT "UserChecklists_creatorId_fkey";

-- AddForeignKey
ALTER TABLE "UserChecklists" ADD CONSTRAINT "UserChecklists_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
