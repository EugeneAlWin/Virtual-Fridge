import { publicDBClient } from '@server/prismaClients'
import { NotFoundError } from 'elysia'

export const setInfo = async (info: { storageId: string; title: string }) => {
	const store = await publicDBClient.storage.findUnique({
		where: { id: info.storageId },
		select: { id: true },
	})
	if (!store)
		throw new NotFoundError(`Storage with id ${info.storageId} not found`)

	await publicDBClient.storage.update({
		where: { id: info.storageId },
		data: { title: info.title },
	})

	return true
}
