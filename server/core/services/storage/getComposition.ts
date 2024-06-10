import { publicDBClient } from '@server/prismaClients'

export const getComposition = async ({
	cursor,
	storageId,
	take = 25,
}: {
	storageId: string
	cursor?: {
		productId: string
		expireDate: Date
		storageId: string
	} | null
	take?: number
}) => {
	const composition = await publicDBClient.storageComposition.findMany({
		where: { storageId },
		skip: cursor ? 1 : 0,
		take,
		cursor: cursor ? { expireDate_storageId_productId: cursor } : undefined,
		include: { product: true },
	})
	const last = composition.at(-1)
	return {
		composition,
		cursor: last
			? {
					productId: last.productId,
					expireDate: last.expireDate,
					storageId: last.storageId,
				}
			: null,
	}
}
