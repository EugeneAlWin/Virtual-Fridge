import { RecipeTypes } from '@prisma/client'
import { publicDBClient } from '@server/prismaClients'
import { NotFoundError } from 'elysia'

export const create = async (recipe: ICreate) => {
	const user = await publicDBClient.user.findUnique({
		where: { id: recipe.info.creatorId },
		select: { id: true },
	})
	if (!user)
		throw new NotFoundError(`USER WITH ID ${recipe.info.creatorId} NOT FOUND`)

	await publicDBClient.recipe.create({
		data: {
			...recipe.info,
			RecipeComposition: { createMany: { data: recipe.composition } },
		},
	})

	return true
}

interface ICreate {
	info: {
		creatorId: string
		title: string
		type: RecipeTypes
		description?: string
		isPrivate?: boolean
		isOfficial?: boolean
		isFrozen?: boolean
	}
	composition: {
		productId: string
		quantity: number
	}[]
}
