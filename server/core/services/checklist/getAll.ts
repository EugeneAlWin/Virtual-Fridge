import { publicDBClient } from '@server/prismaClients'

export const getAll = async ({
	createdAt,
	cursor,
	take = 25,
}: {
	createdAt?: Date
	cursor?: string | null
	take?: number
}) => {
	const lists = await publicDBClient.checklist.findMany({
		skip: cursor ? 1 : 0,
		where: {
			createdAt: createdAt ? { equals: createdAt } : undefined,
		},
		cursor: cursor ? { id: cursor } : undefined,
		take,
	})

	return { lists, cursor: lists.at(-1)?.id ?? null }
}
