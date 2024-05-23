/*
  Warnings:

  - You are about to drop the `Store` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StoreComposition` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "StoreComposition" DROP CONSTRAINT "StoreComposition_productId_fkey";

-- DropForeignKey
ALTER TABLE "StoreComposition" DROP CONSTRAINT "StoreComposition_storeId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET NOT NULL;

-- DropTable
DROP TABLE "Store";

-- DropTable
DROP TABLE "StoreComposition";

-- CreateTable
CREATE TABLE "Storage" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" VARCHAR(30),

    CONSTRAINT "Storage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorageComposition" (
    "purchaseDate" TIMESTAMP(6),
    "expireDate" TIMESTAMP(6) NOT NULL DEFAULT '1970-01-01 00:00:00 +00:00',
    "storageId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productQuantity" SMALLINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Storage_creatorId_key" ON "Storage"("creatorId");

-- CreateIndex
CREATE INDEX "Storage_creatorId_idx" ON "Storage" USING HASH ("creatorId");

-- CreateIndex
CREATE INDEX "StorageComposition_storageId_idx" ON "StorageComposition" USING HASH ("storageId");

-- CreateIndex
CREATE UNIQUE INDEX "StorageComposition_expireDate_storageId_productId_key" ON "StorageComposition"("expireDate", "storageId", "productId");

-- AddForeignKey
ALTER TABLE "Storage" ADD CONSTRAINT "Storage_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorageComposition" ADD CONSTRAINT "StorageComposition_storageId_fkey" FOREIGN KEY ("storageId") REFERENCES "Storage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorageComposition" ADD CONSTRAINT "StorageComposition_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
