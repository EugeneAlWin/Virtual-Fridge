import { publicDBClient } from '@server/prismaClients'

//Experimental
export const checkRefs = async (id: string) => {
	//TODO: check method
	const count = await publicDBClient.product.findFirst({
		where: { id },
		select: {
			_count: {
				select: {
					StorageComposition: true,
					ChecklistComposition: true,
					RecipeComposition: true,
					ProductPullRequest: true,
				},
			},
		},
	})

	return (
		count?._count.StorageComposition ||
		count?._count.ChecklistComposition ||
		count?._count.RecipeComposition ||
		count?._count.ProductPullRequest
	)
}
