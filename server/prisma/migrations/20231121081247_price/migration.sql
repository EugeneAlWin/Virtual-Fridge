/*
  Warnings:

  - Made the column `price` on table `ChecklistComposition` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ChecklistComposition" ALTER COLUMN "price" SET NOT NULL;
