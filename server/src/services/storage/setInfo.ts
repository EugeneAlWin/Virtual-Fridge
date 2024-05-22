import { publicDBClient } from '@server/prismaClients'
import { NotFoundError } from 'elysia'

export const setInfo = async (info: { storeId: string; title: string }) => {
	const store = await publicDBClient.store.findUnique({
		where: { id: info.storeId },
		select: { id: true },
	})
	if (!store)
		throw new NotFoundError(`Store with id ${info.storeId} not found`)

	await publicDBClient.store.update({
		where: { id: info.storeId },
		data: { title: info.title },
	})

	return true
}
