import { publicDBClient } from '@server/prismaClients'

export const addToSelected = (
	userId: string,
	recipeId: string,
	isCooked?: boolean
) =>
	publicDBClient.selectedRecipeForCooking.create({
		data: { userId, recipeId, isCooked },
	})
