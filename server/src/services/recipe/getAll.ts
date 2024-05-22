import { publicDBClient } from '@server/prismaClients'

export const getAll = async ({
	title,
	cursor,
	take = 25,
}: {
	title?: string
	cursor: string | null
	take?: number
}) => {
	const products = await publicDBClient.recipe.findMany({
		skip: cursor ? 1 : 0,
		where: {
			title: title ? { contains: title, mode: 'insensitive' } : undefined,
		},
		cursor: cursor ? { id: cursor } : undefined,
		take,
	})

	return { products, cursor: products.at(-1)?.id ?? null }
}
