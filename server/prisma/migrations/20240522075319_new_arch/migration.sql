-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'DEFAULT', 'GOD');

-- CreateEnum
CREATE TYPE "Currencies" AS ENUM ('USD', 'BYN', 'RUB');

-- CreateEnum
CREATE TYPE "RecipeTypes" AS ENUM ('VEGETARIAN_DISHES', 'BAKING', 'GARNISHES', 'HOT_DISHES', 'HOT_APPETIZERS', 'DESSERTS', 'HOME_MADE_FASTFOOD', 'BREAKFAST', 'PRESERVES', 'CHARCOAL', 'BEVERAGES', 'SALADS', 'SAUCES_PASTAS_AND_DRESSINGS', 'SOUPS_AND_BROTHS', 'DOUGH', 'BREAD', 'COLD_APPETIZERS', 'SHISHKEBABS', 'OTHER');

-- CreateEnum
CREATE TYPE "Units" AS ENUM ('GRAMS', 'KILOGRAMS', 'PIECES', 'TABLESPOON', 'TEASPOON', 'LITER', 'MILLILITER', 'PINCH');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'REJECTED', 'ACCEPTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "login" VARCHAR(30) NOT NULL,
    "password" VARCHAR NOT NULL,
    "role" "Roles" DEFAULT 'DEFAULT',
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "isFrozen" BOOLEAN DEFAULT false,
    "isBlocked" BOOLEAN DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserToken" (
    "userId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "lastLoginAt" TIMESTAMP(6),

    CONSTRAINT "UserToken_pkey" PRIMARY KEY ("userId","deviceId")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" VARCHAR(30),

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreComposition" (
    "purchaseDate" TIMESTAMP(6),
    "expireDate" TIMESTAMP(6) NOT NULL DEFAULT '1970-01-01 00:00:00 +00:00',
    "storeId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productQuantity" SMALLINT NOT NULL
);

-- CreateTable
CREATE TABLE "Checklist" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Checklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistComposition" (
    "checklistId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productQuantity" SMALLINT NOT NULL,
    "price" MONEY NOT NULL DEFAULT 0,
    "currency" "Currencies" NOT NULL DEFAULT 'BYN',

    CONSTRAINT "ChecklistComposition_pkey" PRIMARY KEY ("checklistId","productId")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT,
    "title" VARCHAR(50) NOT NULL,
    "calories" SMALLINT NOT NULL,
    "protein" SMALLINT NOT NULL,
    "fats" SMALLINT NOT NULL,
    "carbohydrates" SMALLINT NOT NULL,
    "unit" "Units" NOT NULL DEFAULT 'GRAMS',
    "isOfficial" BOOLEAN DEFAULT false,
    "isFrozen" BOOLEAN DEFAULT false,
    "isRecipePossible" BOOLEAN DEFAULT false,
    "averageShelfLifeInDays" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT,
    "productId" TEXT,
    "title" VARCHAR(100) NOT NULL,
    "type" "RecipeTypes" NOT NULL,
    "description" VARCHAR(10000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPrivate" BOOLEAN DEFAULT true,
    "isOfficial" BOOLEAN DEFAULT false,
    "isFrozen" BOOLEAN DEFAULT false,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeComposition" (
    "recipeId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" SMALLINT NOT NULL,

    CONSTRAINT "RecipeComposition_pkey" PRIMARY KEY ("productId","recipeId")
);

-- CreateTable
CREATE TABLE "RecipeRating" (
    "recipeId" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "RecipeRating_pkey" PRIMARY KEY ("recipeId")
);

-- CreateTable
CREATE TABLE "UserGrade" (
    "recipeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,

    CONSTRAINT "UserGrade_pkey" PRIMARY KEY ("recipeId","userId")
);

-- CreateTable
CREATE TABLE "FavoriteRecipe" (
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteRecipe_pkey" PRIMARY KEY ("recipeId","userId")
);

-- CreateTable
CREATE TABLE "SelectedRecipeForCooking" (
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "selectedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCooked" BOOLEAN NOT NULL DEFAULT false,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SelectedRecipeForCooking_pkey" PRIMARY KEY ("userId","recipeId")
);

-- CreateTable
CREATE TABLE "RecipePullRequest" (
    "creatorId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "comment" TEXT
);

-- CreateTable
CREATE TABLE "ProductPullRequest" (
    "creatorId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "comment" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE INDEX "User_login_idx" ON "User"("login");

-- CreateIndex
CREATE INDEX "UserToken_lastLoginAt_idx" ON "UserToken"("lastLoginAt");

-- CreateIndex
CREATE UNIQUE INDEX "Store_creatorId_key" ON "Store"("creatorId");

-- CreateIndex
CREATE INDEX "Store_creatorId_idx" ON "Store" USING HASH ("creatorId");

-- CreateIndex
CREATE INDEX "StoreComposition_storeId_idx" ON "StoreComposition" USING HASH ("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "StoreComposition_expireDate_storeId_productId_key" ON "StoreComposition"("expireDate", "storeId", "productId");

-- CreateIndex
CREATE INDEX "Checklist_creatorId_idx" ON "Checklist" USING HASH ("creatorId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_title_key" ON "Product"("title");

-- CreateIndex
CREATE INDEX "Product_title_idx" ON "Product"("title");

-- CreateIndex
CREATE INDEX "Recipe_isOfficial_type_title_idx" ON "Recipe"("isOfficial", "type", "title");

-- CreateIndex
CREATE INDEX "RecipeRating_rating_idx" ON "RecipeRating"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "RecipePullRequest_recipeId_key" ON "RecipePullRequest"("recipeId");

-- CreateIndex
CREATE INDEX "RecipePullRequest_creatorId_idx" ON "RecipePullRequest" USING HASH ("creatorId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductPullRequest_productId_key" ON "ProductPullRequest"("productId");

-- CreateIndex
CREATE INDEX "ProductPullRequest_creatorId_idx" ON "ProductPullRequest" USING HASH ("creatorId");

-- AddForeignKey
ALTER TABLE "UserToken" ADD CONSTRAINT "UserToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreComposition" ADD CONSTRAINT "StoreComposition_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreComposition" ADD CONSTRAINT "StoreComposition_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistComposition" ADD CONSTRAINT "ChecklistComposition_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "Checklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistComposition" ADD CONSTRAINT "ChecklistComposition_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeComposition" ADD CONSTRAINT "RecipeComposition_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeComposition" ADD CONSTRAINT "RecipeComposition_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeRating" ADD CONSTRAINT "RecipeRating_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGrade" ADD CONSTRAINT "UserGrade_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGrade" ADD CONSTRAINT "UserGrade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteRecipe" ADD CONSTRAINT "FavoriteRecipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteRecipe" ADD CONSTRAINT "FavoriteRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectedRecipeForCooking" ADD CONSTRAINT "SelectedRecipeForCooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectedRecipeForCooking" ADD CONSTRAINT "SelectedRecipeForCooking_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipePullRequest" ADD CONSTRAINT "RecipePullRequest_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipePullRequest" ADD CONSTRAINT "RecipePullRequest_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPullRequest" ADD CONSTRAINT "ProductPullRequest_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPullRequest" ADD CONSTRAINT "ProductPullRequest_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
