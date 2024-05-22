-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "averageShelfLifeInDays" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "StoreComposition" ALTER COLUMN "expireDate" SET DEFAULT '1970-01-01 00:00:00 +00:00';
