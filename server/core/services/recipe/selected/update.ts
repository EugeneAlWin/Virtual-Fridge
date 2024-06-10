import { publicDBClient } from '@server/prismaClients'

export const updateSelected = ({
	recipeId,
	userId,
	isCooked,
}: {
	userId: string
	recipeId: string
	isCooked: boolean
}) =>
	publicDBClient.selectedRecipeForCooking.update({
		where: { userId_recipeId: { recipeId, userId } },
		data: { isCooked },
	})
