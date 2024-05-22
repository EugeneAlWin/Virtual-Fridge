import { publicDBClient } from '@server/prismaClients'

export const addToFavorite = (userId: string, recipeId: string) =>
	publicDBClient.favoriteRecipe.create({
		data: { recipeId, userId },
	})
