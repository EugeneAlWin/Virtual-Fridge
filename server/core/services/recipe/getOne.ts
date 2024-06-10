import { publicDBClient } from '@server/prismaClients'

export const getOne = async (id: string) =>
	publicDBClient.recipe.findUnique({
		where: { id },
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
	})
