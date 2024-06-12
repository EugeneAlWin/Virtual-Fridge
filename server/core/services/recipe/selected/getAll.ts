import { publicDBClient } from '@server/prismaClients'

export const getAllSelected = async ({
	cursor,
	userId,
}: {
	title?: string
	cursor?: string | null
	take?: number
	userId: string
}) => {
	const recipes = await publicDBClient.selectedRecipeForCooking.findMany({
		skip: cursor ? 1 : 0,
		where: {
			userId,
		},
		include: {
			recipe: {
				include: { RecipeComposition: { include: { product: true } } },
			},
		},
	})

	return { recipes, cursor: recipes.at(-1)?.recipeId ?? null }
}
