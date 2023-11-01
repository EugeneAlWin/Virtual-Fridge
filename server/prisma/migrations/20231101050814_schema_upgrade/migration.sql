/*
  Warnings:

  - You are about to drop the column `checklistId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Checklist" DROP CONSTRAINT "Checklist_creatorId_fkey";

-- DropIndex
DROP INDEX "ChecklistComposition_checklistId_key";

-- DropIndex
DROP INDEX "ChosenRecipe_id_key";

-- DropIndex
DROP INDEX "FavoriteRecipe_id_key";

-- DropIndex
DROP INDEX "RecipeComposition_recipeId_key";

-- DropIndex
DROP INDEX "StoreComposition_productId_key";

-- DropIndex
DROP INDEX "StoreComposition_storeId_key";

-- AlterTable
ALTER TABLE "ChecklistComposition" ADD COLUMN     "currency" "Currencies" NOT NULL DEFAULT 'BYN',
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "price" MONEY DEFAULT 0,
ADD COLUMN     "units" "Units" NOT NULL DEFAULT 'PIECES',
ADD CONSTRAINT "ChecklistComposition_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ChosenRecipe" ADD CONSTRAINT "ChosenRecipe_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "FavoriteRecipe" ADD CONSTRAINT "FavoriteRecipe_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "RecipeComposition" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "RecipeComposition_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "StoreComposition" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "StoreComposition_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "checklistId";

-- CreateTable
CREATE TABLE "UserChecklists" (
    "creatorId" INTEGER NOT NULL,
    "checklistId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ChecklistPrices" (
    "checklistId" INTEGER NOT NULL,
    "USD" MONEY NOT NULL DEFAULT 0,
    "BYN" MONEY NOT NULL DEFAULT 0,
    "RUB" MONEY NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "UserChecklists_checklistId_key" ON "UserChecklists"("checklistId");

-- CreateIndex
CREATE UNIQUE INDEX "ChecklistPrices_checklistId_key" ON "ChecklistPrices"("checklistId");

-- AddForeignKey
ALTER TABLE "UserChecklists" ADD CONSTRAINT "UserChecklists_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChecklists" ADD CONSTRAINT "UserChecklists_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "Checklist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistPrices" ADD CONSTRAINT "ChecklistPrices_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "Checklist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
