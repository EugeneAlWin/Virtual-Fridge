import { publicDBClient } from '@server/prismaClients'

export const removeFromFavorite = (params: {
	userId: string
	recipeId: string
}) =>
	publicDBClient.favoriteRecipe.delete({
		where: { recipeId_userId: params },
	})
