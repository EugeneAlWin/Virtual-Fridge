import { publicDBClient } from '@server/prismaClients'

export const getComposition = async ({
	cursor,
	take = 25,
}: {
	cursor: {
		productId: string
		expireDate: Date
		storeId: string
	}
	take?: number
}) => {
	return publicDBClient.storeComposition.findMany({
		where: { storeId: cursor.storeId },
		take,
		cursor: cursor ? { expireDate_storeId_productId: cursor } : undefined,
		include: { product: true },
	})
}
