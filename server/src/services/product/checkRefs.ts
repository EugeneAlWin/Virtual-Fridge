import { publicDBClient } from '@server/prismaClients'

//Experimental
export const checkRefs = async (id: string) => {
	//TODO: check method
	const count = await publicDBClient.product.findFirst({
		where: { id },
		select: {
			_count: {
				select: {
					StoreComposition: true,
					ChecklistComposition: true,
					RecipeComposition: true,
					Recipe: true,
					ProductPullRequest: true,
				},
			},
		},
	})

	return (
		count?._count.StoreComposition ||
		count?._count.ChecklistComposition ||
		count?._count.RecipeComposition ||
		count?._count.Recipe ||
		count?._count.ProductPullRequest
	)
}
