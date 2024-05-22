import { publicDBClient } from '@server/prismaClients'

export const setProducts = async (
	products: {
		expireDate: Date
		storeId: string
		productId: string
		purchaseDate?: Date
		productQuantity: number
	}[]
) => {
	const transactions = products.map(product =>
		publicDBClient.storeComposition.upsert({
			where: {
				expireDate_storeId_productId: {
					expireDate: product.expireDate,
					productId: product.productId,
					storeId: product.storeId,
				},
			},
			create: product,
			update: product,
		})
	)

	try {
		await publicDBClient.$transaction(transactions)
		return true
	} catch (e) {
		return false
	}
}
