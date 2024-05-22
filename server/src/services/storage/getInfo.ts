import { publicDBClient } from '@server/prismaClients'
import { NotFoundError } from 'elysia'

export const getInfo = async (creatorId: string) => {
	const store = await publicDBClient.store.findUnique({
		where: { creatorId },
		select: { id: true, title: true },
	})

	if (!store)
		throw new NotFoundError(`STORE WITH CREATOR_ID ${creatorId} NOT FOUND`)

	return store
}
