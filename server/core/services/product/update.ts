import { Units } from '@prisma/client'
import { publicDBClient } from '@server/prismaClients'
import { NotFoundError } from 'elysia'

export const update = async (product: IUpdate) => {
	const productInfo = await publicDBClient.product.findUnique({
		where: { id: product.id },
		select: { title: true },
	})

	if (!productInfo) throw new NotFoundError('Product not found')
	if (productInfo.title === product.title)
		throw new Error('PRODUCT TITLE ALREADY TAKEN')

	await publicDBClient.product.update({
		where: { id: product.id },
		data: product,
	})

	return true
}

interface IUpdate {
	id: string
	title?: string
	calories?: number
	protein?: number
	fats?: number
	carbohydrates?: number
	isOfficial?: boolean
	isFrozen?: boolean
	isRecipePossible?: boolean
	averageShelfLifeInDays?: number
	unit?: Units
}
