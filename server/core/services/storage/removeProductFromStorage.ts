import { publicDBClient } from '@server/prismaClients'

export const removeProductFromStorage = async ({
	storageId,
	productId,
}: {
	storageId: string
	productId: string
}) => {
	return publicDBClient.storageComposition.delete({
		where: {
			expireDate_storageId_productId: {
				storageId,
				productId,
				expireDate: new Date('1970-01-01T00:00:00.00Z'),
			},
		},
	})
}
