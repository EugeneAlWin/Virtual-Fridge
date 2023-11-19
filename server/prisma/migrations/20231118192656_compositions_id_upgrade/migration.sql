/*
  Warnings:

  - The primary key for the `ChecklistComposition` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ChecklistComposition` table. All the data in the column will be lost.
  - The primary key for the `RecipeComposition` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `RecipeComposition` table. All the data in the column will be lost.
  - The primary key for the `StoreComposition` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `StoreComposition` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `UserToken` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "UserToken_id_key";

-- DropIndex
DROP INDEX "UserToken_userId_deviceId_key";

-- AlterTable
ALTER TABLE "ChecklistComposition" DROP CONSTRAINT "ChecklistComposition_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ChecklistComposition_pkey" PRIMARY KEY ("checklistId", "productId");

-- AlterTable
ALTER TABLE "RecipeComposition" DROP CONSTRAINT "RecipeComposition_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "RecipeComposition_pkey" PRIMARY KEY ("productId", "recipeId");

-- AlterTable
ALTER TABLE "StoreComposition" DROP CONSTRAINT "StoreComposition_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "StoreComposition_pkey" PRIMARY KEY ("storeId", "productId");

-- AlterTable
ALTER TABLE "UserToken" DROP COLUMN "id",
ADD CONSTRAINT "UserToken_pkey" PRIMARY KEY ("userId", "deviceId");
