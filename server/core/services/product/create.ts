import { publicDBClient } from '@server/prismaClients'
import { NotFoundError } from 'elysia'
import { Units } from '~shared/enums'

export const create = async (product: ICreate) => {
	const user = await publicDBClient.user.findUnique({
		where: { id: product.creatorId },
		select: { id: true },
	})
	if (!user)
		throw new NotFoundError(`USER WITH ID ${product.creatorId} NOT FOUND`)

	const productId = await publicDBClient.product.findUnique({
		where: { title: product.title },
		select: { id: true },
	})

	if (productId) throw new Error('PRODUCT TITLE ALREADY TAKEN')

	return publicDBClient.product.create({
		data: product,
	})
}

interface ICreate {
	creatorId: string
	title: string
	calories: number
	protein: number
	fats: number
	carbohydrates: number
	isOfficial: boolean
	isFrozen: boolean
	isRecipePossible: boolean
	averageShelfLifeInDays?: number
	unit: Units
}
