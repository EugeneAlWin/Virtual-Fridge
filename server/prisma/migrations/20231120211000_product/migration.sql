-- DropForeignKey
ALTER TABLE "ChecklistComposition" DROP CONSTRAINT "ChecklistComposition_productId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeComposition" DROP CONSTRAINT "RecipeComposition_productId_fkey";

-- DropForeignKey
ALTER TABLE "StoreComposition" DROP CONSTRAINT "StoreComposition_productId_fkey";

-- AddForeignKey
ALTER TABLE "StoreComposition" ADD CONSTRAINT "StoreComposition_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeComposition" ADD CONSTRAINT "RecipeComposition_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistComposition" ADD CONSTRAINT "ChecklistComposition_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
