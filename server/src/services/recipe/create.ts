import { Units } from '@prisma/client'
import { publicDBClient } from '@server/prismaClients'
import { NotFoundError } from 'elysia'

export const create = async (recipe: ICreate) => {
	const user = await publicDBClient.user.findUnique({
		where: { id: recipe.creatorId },
		select: { id: true },
	})
	if (!user)
		throw new NotFoundError(`USER WITH ID ${recipe.creatorId} NOT FOUND`)

	await publicDBClient.recipe.create({
		data: {},
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
