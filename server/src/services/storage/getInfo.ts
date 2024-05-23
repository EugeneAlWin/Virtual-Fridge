import { publicDBClient } from '@server/prismaClients'
import { NotFoundError } from 'elysia'

export const getInfo = async (creatorId: string) => {
	const storage = await publicDBClient.storage.findUnique({
		where: { creatorId },
		select: { id: true, title: true },
	})

	if (!storage)
		throw new NotFoundError(`STORAGE WITH CREATOR_ID ${creatorId} NOT FOUND`)

	return storage
}
