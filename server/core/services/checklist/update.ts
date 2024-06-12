import { publicDBClient } from '@server/prismaClients'
import { NotFoundError } from 'elysia'

export const update = async ({ userId, products, checklistId }: IUpdate) => {
	const user = await publicDBClient.user.findUnique({
		where: { id: userId },
		select: { id: true },
	})
	if (!user) throw new NotFoundError(`USER WITH ID ${userId} NOT FOUND`)

	return publicDBClient.$transaction(
		products.map(product =>
			publicDBClient.checklistComposition.upsert({
				where: {
					checklistId_productId: { checklistId, productId: product.id },
				},
				create: {
					checklistId,
					productId: product.id,
					productQuantity: product.quantity,
				},
				update: {
					productQuantity: product.quantity,
				},
			})
		)
	)
}

interface IUpdate {
	userId: string
	checklistId: string
	products: {
		id: string
		quantity: number
	}[]
}
