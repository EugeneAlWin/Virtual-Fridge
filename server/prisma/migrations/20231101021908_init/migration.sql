-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'DEFAULT');

-- CreateEnum
CREATE TYPE "Units" AS ENUM ('GRAMS', 'KILOGRAMS', 'ITEMS', 'PIECES');

-- CreateEnum
CREATE TYPE "Currencies" AS ENUM ('USD', 'BYN', 'RUB');

-- CreateEnum
CREATE TYPE "RecipeTypes" AS ENUM ('VEGETARIAN', 'PASTRIES', 'GARNISHES', 'HOTDISHES', 'HOTAPPETIZERS', 'DESSERTS', 'HOMEMADE', 'BREAKFASTS', 'PRESERVES', 'CHARCOAL', 'BEVERAGES', 'SALADS', 'SAUCESPASTASDRESSINGS', 'SOUPSBROTHS', 'DOUGHS', 'BREAD', 'COLDAPPETIZERS', 'SHASHLIKS');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "login" VARCHAR(30) NOT NULL,
    "password" VARCHAR(120) NOT NULL,
    "role" "Roles" NOT NULL DEFAULT 'DEFAULT',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checklistId" INTEGER NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserToken" (
    "id" SERIAL NOT NULL,
    "deviceId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Store" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50),
    "creatorId" INTEGER NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreComposition" (
    "storeId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" SMALLINT NOT NULL,
    "unit" "Units" NOT NULL DEFAULT 'ITEMS',
    "expires" TIMESTAMP,
    "price" MONEY NOT NULL,
    "currency" "Currencies" NOT NULL DEFAULT 'BYN'
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "calories" SMALLINT NOT NULL,
    "protein" SMALLINT NOT NULL,
    "fats" SMALLINT NOT NULL,
    "carbohydrates" SMALLINT NOT NULL,
    "creatorId" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "type" "RecipeTypes" NOT NULL,
    "description" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" INTEGER NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeComposition" (
    "recipeId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" SMALLINT NOT NULL
);

-- CreateTable
CREATE TABLE "ChosenRecipe" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCooked" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "FavoriteRecipe" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "recipeId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Checklist" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "creatorId" INTEGER NOT NULL,

    CONSTRAINT "Checklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistComposition" (
    "checklistId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" SMALLINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "UserToken_id_key" ON "UserToken"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Store_creatorId_key" ON "Store"("creatorId");

-- CreateIndex
CREATE UNIQUE INDEX "StoreComposition_storeId_key" ON "StoreComposition"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "StoreComposition_productId_key" ON "StoreComposition"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_title_key" ON "Product"("title");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeComposition_recipeId_key" ON "RecipeComposition"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "ChosenRecipe_id_key" ON "ChosenRecipe"("id");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteRecipe_id_key" ON "FavoriteRecipe"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Checklist_creatorId_key" ON "Checklist"("creatorId");

-- CreateIndex
CREATE UNIQUE INDEX "ChecklistComposition_checklistId_key" ON "ChecklistComposition"("checklistId");

-- AddForeignKey
ALTER TABLE "UserToken" ADD CONSTRAINT "UserToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreComposition" ADD CONSTRAINT "StoreComposition_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreComposition" ADD CONSTRAINT "StoreComposition_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeComposition" ADD CONSTRAINT "RecipeComposition_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeComposition" ADD CONSTRAINT "RecipeComposition_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChosenRecipe" ADD CONSTRAINT "ChosenRecipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteRecipe" ADD CONSTRAINT "FavoriteRecipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteRecipe" ADD CONSTRAINT "FavoriteRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistComposition" ADD CONSTRAINT "ChecklistComposition_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "Checklist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistComposition" ADD CONSTRAINT "ChecklistComposition_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
