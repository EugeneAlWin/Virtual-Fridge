-- DropForeignKey
ALTER TABLE "ChecklistComposition" DROP CONSTRAINT "ChecklistComposition_checklistId_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistPrices" DROP CONSTRAINT "ChecklistPrices_checklistId_fkey";

-- AddForeignKey
ALTER TABLE "ChecklistComposition" ADD CONSTRAINT "ChecklistComposition_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "Checklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistPrices" ADD CONSTRAINT "ChecklistPrices_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "Checklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
