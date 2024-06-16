import { publicDBClient } from '@server/prismaClients'

export const addProductToStorage = async ({
	storageId,
	productId,
	productQuantity,
	expireDate,
}: {
	storageId: string
	productId: string
	expireDate?: Date
	productQuantity: number
}) =>
	publicDBClient.storageComposition.upsert({
		where: {
			expireDate_storageId_productId: {
				storageId,
				productId,
				expireDate: expireDate ?? new Date('1970-01-01T00:00:00.00Z'),
			},
		},
		create: {
			storageId,
			productId,
			productQuantity,
			expireDate,
			purchaseDate: new Date('1970-01-01T00:00:00.00Z'),
		},
		update: {
			storageId,
			productId,
			productQuantity,
			expireDate,
			purchaseDate: new Date('1970-01-01T00:00:00.00Z'),
		},
	})
