import { publicDBClient } from '@server/prismaClients'

export const removeProductFromStorage = async ({
	storageId,
	productId,
	productQuantity,
	expireDate,
}: {
	storageId: string
	productId: string
	expireDate: Date
	productQuantity: number
}) => {
	if (!productQuantity)
		return publicDBClient.storageComposition.delete({
			where: {
				expireDate_storageId_productId: {
					storageId,
					productId,
					expireDate,
				},
			},
		})

	return publicDBClient.storageComposition.update({
		where: {
			expireDate_storageId_productId: { storageId, productId, expireDate },
		},
		data: { productQuantity },
	})
}
