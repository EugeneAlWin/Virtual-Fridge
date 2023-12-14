/*
  Warnings:

  - You are about to drop the column `units` on the `ChecklistComposition` table. All the data in the column will be lost.
  - You are about to drop the column `units` on the `RecipeComposition` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `StoreComposition` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChecklistComposition" DROP COLUMN "units";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "units" "Units" NOT NULL DEFAULT 'ITEMS';

-- AlterTable
ALTER TABLE "RecipeComposition" DROP COLUMN "units";

-- AlterTable
ALTER TABLE "StoreComposition" DROP COLUMN "unit";
