import { publicDBClient } from '@server/prismaClients'

export const getAllSelected = async ({
	cursor,
	take = 25,
}: {
	cursor: { userId: string; recipeId: string }
	take?: number
}) => {
	const recipes = await publicDBClient.selectedRecipeForCooking.findMany({
		skip: cursor ? 1 : 0,
		where: {
			userId: cursor.userId,
		},
		cursor: cursor ? { userId_recipeId: cursor } : undefined,
		take,
		include: { recipe: true },
	})
	const lastElement = recipes.at(-1)
	return {
		recipes,
		cursor: lastElement
			? { userId: lastElement.userId, recipeId: lastElement.recipeId }
			: null,
	}
}
