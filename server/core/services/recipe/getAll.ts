import { publicDBClient } from '@server/prismaClients'

//TODO: optimize RecipeComposition
export const getAll = async ({
	title,
	cursor,
	take = 25,
}: {
	title?: string
	cursor?: string | null
	take?: number
}) => {
	const recipes = await publicDBClient.recipe.findMany({
		skip: cursor ? 1 : 0,
		where: {
			title: title ? { contains: title, mode: 'insensitive' } : undefined,
		},
		include: {
			RecipeComposition: {
				select: {
					quantity: true,
					product: {
						select: {
							id: true,
							creatorId: true,
							title: true,
							unit: true,
						},
					},
				},
			},
		},
		cursor: cursor ? { id: cursor } : undefined,
		take,
	})

	return { recipes, cursor: recipes.at(-1)?.id ?? null }
}
