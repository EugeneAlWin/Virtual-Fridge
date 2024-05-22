import { publicDBClient } from '@server/prismaClients'

export const removeFromSelected = (userId: string, recipeId: string) =>
	publicDBClient.selectedRecipeForCooking.delete({
		where: { userId_recipeId: { userId, recipeId } },
	})
