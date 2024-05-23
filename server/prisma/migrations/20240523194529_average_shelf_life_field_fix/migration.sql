-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "averageShelfLifeInDays" DROP NOT NULL,
ALTER COLUMN "averageShelfLifeInDays" DROP DEFAULT;
