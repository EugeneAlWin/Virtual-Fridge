import { publicDBClient } from '@server/prismaClients'

export const removeFromSelected = (data: {
	userId: string
	recipeId: string
}) =>
	publicDBClient.selectedRecipeForCooking.delete({
		where: { userId_recipeId: data },
	})
