/*
  Warnings:

  - A unique constraint covering the columns `[recipeId,userId]` on the table `FavoriteRecipe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FavoriteRecipe_recipeId_userId_key" ON "FavoriteRecipe"("recipeId", "userId");
