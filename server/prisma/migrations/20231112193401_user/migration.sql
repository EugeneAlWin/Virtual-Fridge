-- DropForeignKey
ALTER TABLE "ChecklistComposition" DROP CONSTRAINT "ChecklistComposition_productId_fkey";

-- DropForeignKey
ALTER TABLE "ChosenRecipe" DROP CONSTRAINT "ChosenRecipe_userId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteRecipe" DROP CONSTRAINT "FavoriteRecipe_userId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeComposition" DROP CONSTRAINT "RecipeComposition_productId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeComposition" DROP CONSTRAINT "RecipeComposition_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "StoreComposition" DROP CONSTRAINT "StoreComposition_productId_fkey";

-- DropForeignKey
ALTER TABLE "StoreComposition" DROP CONSTRAINT "StoreComposition_storeId_fkey";

-- DropForeignKey
ALTER TABLE "UserChecklists" DROP CONSTRAINT "UserChecklists_checklistId_fkey";

-- DropForeignKey
ALTER TABLE "UserChecklists" DROP CONSTRAINT "UserChecklists_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "UserToken" DROP CONSTRAINT "UserToken_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserToken" ADD CONSTRAINT "UserToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreComposition" ADD CONSTRAINT "StoreComposition_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreComposition" ADD CONSTRAINT "StoreComposition_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeComposition" ADD CONSTRAINT "RecipeComposition_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeComposition" ADD CONSTRAINT "RecipeComposition_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChosenRecipe" ADD CONSTRAINT "ChosenRecipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteRecipe" ADD CONSTRAINT "FavoriteRecipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistComposition" ADD CONSTRAINT "ChecklistComposition_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChecklists" ADD CONSTRAINT "UserChecklists_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "Checklist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChecklists" ADD CONSTRAINT "UserChecklists_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
