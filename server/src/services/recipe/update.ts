import { Units } from '@prisma/client'
import { publicDBClient } from '@server/prismaClients'
import { NotFoundError } from 'elysia'

export const update = async (recipe: IUpdate) => {
	const recipeInfo = await publicDBClient.recipe.findFirst({
		where: { id: recipe.id },
		select: { title: true },
	})

	if (!recipeInfo) throw new NotFoundError('Recipe not found')

	await publicDBClient.recipe.update({
		where: { id: recipe.id },

		data: recipe,
	})

	return true
}

interface IUpdate {
	creatorId: string
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
