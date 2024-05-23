import { publicDBClient } from '@server/prismaClients'

export const setComposition = async (
	products: {
		expireDate?: Date
		storageId: string
		productId: string
		purchaseDate?: Date
		productQuantity: number
	}[]
) => {
	const transactions = products.map(product =>
		publicDBClient.storageComposition.upsert({
			where: {
				expireDate_storageId_productId: {
					expireDate:
						product.expireDate ?? new Date('1970-01-01T00:00:00.00Z'),
					productId: product.productId,
					storageId: product.storageId,
				},
			},
			create: product,
			update: { ...product, productId: undefined, storageId: undefined },
		})
	)

	try {
		await publicDBClient.$transaction(transactions)
		return true
	} catch (e) {
		return false
	}
}
