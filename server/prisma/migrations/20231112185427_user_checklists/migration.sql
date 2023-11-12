-- DropForeignKey
ALTER TABLE "UserChecklists" DROP CONSTRAINT "UserChecklists_checklistId_fkey";

-- AddForeignKey
ALTER TABLE "UserChecklists" ADD CONSTRAINT "UserChecklists_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "Checklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
