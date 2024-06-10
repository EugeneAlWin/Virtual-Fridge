/*
  Warnings:

  - The values [MODERATOR] on the enum `Roles` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `createdAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Roles_new" AS ENUM ('ADMIN', 'DEFAULT', 'GOD');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Roles_new" USING ("role"::text::"Roles_new");
ALTER TYPE "Roles" RENAME TO "Roles_old";
ALTER TYPE "Roles_new" RENAME TO "Roles";
DROP TYPE "Roles_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'DEFAULT';
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET NOT NULL;
