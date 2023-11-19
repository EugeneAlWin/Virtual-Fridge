-- AddForeignKey
ALTER TABLE "ChosenRecipe" ADD CONSTRAINT "ChosenRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
