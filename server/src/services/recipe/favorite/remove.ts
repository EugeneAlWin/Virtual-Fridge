import { publicDBClient } from '@server/prismaClients'

export const removeFromFavorite = (userId: string, recipeId: string) =>
	publicDBClient.favoriteRecipe.delete({
		where: { recipeId_userId: { userId, recipeId } },
	})
