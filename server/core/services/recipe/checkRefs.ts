import { publicDBClient } from '@server/prismaClients'

//Experimental
export const checkRefs = async (id: string) => {
	//TODO: check method
	const count = await publicDBClient.recipe.findUnique({
		where: { id },
		select: {
			_count: {
				select: {
					ChosenRecipe: true,
					FavoriteRecipe: true,
					RecipePullRequest: true,
				},
			},
		},
	})

	return (
		count?._count.ChosenRecipe ||
		count?._count.FavoriteRecipe ||
		count?._count.RecipePullRequest
	)
}
