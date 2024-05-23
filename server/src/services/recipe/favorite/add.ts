import { publicDBClient } from '@server/prismaClients'

export const addToFavorite = (params: { userId: string; recipeId: string }) =>
	publicDBClient.favoriteRecipe.create({
		data: params,
	})
