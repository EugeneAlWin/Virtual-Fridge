import { Units } from '@prisma/client'
import { publicDBClient } from '@server/prismaClients'
import { NotFoundError } from 'elysia'

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

	await publicDBClient.product.create({
		data: product,
		select: {},
	})

	return true
}

interface ICreate {
	creatorId: string
	title: string
	calories: number
	protein: number
	fats: number
	carbohydrates: number
	userId: string
	isOfficial: boolean
	isFrozen: boolean
	isRecipePossible: boolean
	averageShelfLifeInDays?: number
	unit: Units
}
