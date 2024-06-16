import { publicDBClient } from '@server/prismaClients'
import { NotFoundError } from 'elysia'
import { filter, isTruthy } from 'remeda'
import { RecipeTypes } from '~shared/enums'

//TODO
export const update = async (recipe: IUpdate) => {
	const recipeInfo = await publicDBClient.recipe.findFirst({
		where: { id: recipe.info.id },
		select: { title: true },
	})

	if (!recipeInfo) throw new NotFoundError('Recipe not found')

	const ops = [
		recipe.composition &&
			publicDBClient.recipeComposition.deleteMany({
				where: { recipeId: recipe.info.id },
			}),
		publicDBClient.recipe.update({
			where: { id: recipe.info.id },
			data: {
				...recipe.info,
				RecipeComposition: recipe.composition
					? { createMany: { data: recipe.composition } }
					: undefined,
			},
		}),
	]

	await publicDBClient.$transaction(filter(ops, isTruthy))
	return true
}

interface IUpdate {
	info: {
		id: string
		title?: string
		type?: RecipeTypes
		description?: string
		isPrivate?: boolean
		isOfficial?: boolean
		isFrozen?: boolean
	}
	composition?: {
		productId: string
		quantity: number
	}[]
}
