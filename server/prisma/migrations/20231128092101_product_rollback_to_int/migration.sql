/*
  Warnings:

  - You are about to alter the column `calories` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Real` to `SmallInt`.
  - You are about to alter the column `protein` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Real` to `SmallInt`.
  - You are about to alter the column `fats` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Real` to `SmallInt`.
  - You are about to alter the column `carbohydrates` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Real` to `SmallInt`.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "calories" SET DATA TYPE SMALLINT,
ALTER COLUMN "protein" SET DATA TYPE SMALLINT,
ALTER COLUMN "fats" SET DATA TYPE SMALLINT,
ALTER COLUMN "carbohydrates" SET DATA TYPE SMALLINT;
