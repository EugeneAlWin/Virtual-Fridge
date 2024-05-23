import { publicDBClient } from '@server/prismaClients'

export const getAllFavorites = async ({
	cursor,
	take = 25,
	title,
}: {
	title?: string
	cursor: { userId: string; recipeId: string } | null
	take?: number
}) => {
	const recipes = await publicDBClient.favoriteRecipe.findMany({
		skip: cursor ? 1 : 0,
		where: {
			recipe: {
				title: title ? { contains: title, mode: 'insensitive' } : undefined,
			},
		},
		cursor: cursor ? { recipeId_userId: cursor } : undefined,
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
