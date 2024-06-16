import { publicDBClient } from '@server/prismaClients'

export const getAllFavorites = async ({
	title,
	userId,
}: {
	title?: string
	userId: string
	take?: number
}) => {
	const recipes = await publicDBClient.favoriteRecipe.findMany({
		where: {
			userId,
			recipe: {
				title: title ? { contains: title, mode: 'insensitive' } : undefined,
			},
		},
		include: {
			recipe: {
				include: { RecipeComposition: { include: { product: true } } },
			},
		},
	})
	const lastElement = recipes.at(-1)
	return {
		recipes,
		cursor: lastElement
			? { userId: lastElement.userId, recipeId: lastElement.recipeId }
			: null,
	}
}
