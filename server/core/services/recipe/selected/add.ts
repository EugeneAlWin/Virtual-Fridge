import { publicDBClient } from '@server/prismaClients'

export const addToSelected = (data: {
	userId: string
	recipeId: string
	isCooked?: boolean
}) =>
	publicDBClient.selectedRecipeForCooking.create({
		data,
	})
