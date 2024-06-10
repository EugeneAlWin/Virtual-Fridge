-- AlterEnum
ALTER TYPE "Units" ADD VALUE 'PORTION';

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "productRef" TEXT;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_productRef_fkey" FOREIGN KEY ("productRef") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
