/*
  Warnings:

  - Made the column `isOfficial` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isFrozen` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isRecipePossible` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isPrivate` on table `Recipe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isOfficial` on table `Recipe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isFrozen` on table `Recipe` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "Units" ADD VALUE 'ITEMS';

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "isOfficial" SET NOT NULL,
ALTER COLUMN "isFrozen" SET NOT NULL,
ALTER COLUMN "isRecipePossible" SET NOT NULL;

-- AlterTable
ALTER TABLE "Recipe" ALTER COLUMN "isPrivate" SET NOT NULL,
ALTER COLUMN "isOfficial" SET NOT NULL,
ALTER COLUMN "isFrozen" SET NOT NULL;
