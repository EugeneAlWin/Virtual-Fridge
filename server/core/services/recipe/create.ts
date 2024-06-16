import { publicDBClient } from '@server/prismaClients'
import { NotFoundError } from 'elysia'
import { RecipeTypes, Units } from '~shared/enums'

export const create = async (recipe: ICreate) => {
	const user = await publicDBClient.user.findUnique({
		where: { id: recipe.info.creatorId },
		select: { id: true },
	})
	if (!user)
		throw new NotFoundError(`USER WITH ID ${recipe.info.creatorId} NOT FOUND`)

	if (
		await publicDBClient.recipe.findUnique({
			where: { title: recipe.info.title },
			select: { id: true },
		})
	)
		throw new Error('RECIPE ALREADY EXISTS')

	const productWithTheSameName = await publicDBClient.product.findUnique({
		where: { title: recipe.info.title },
	})
	if (productWithTheSameName && !productWithTheSameName?.isRecipePossible)
		throw new Error('RECIPE IS NOT POSSIBLE FOR THIS PRODUCT')

	const productsPFCC_Sum = await publicDBClient.product.aggregate({
		where: { id: { in: recipe.composition.map(i => i.productId) } },
		_sum: { fats: true, carbohydrates: true, protein: true, calories: true },
	})
	//TODO: complex product cannot be created without a recipe
	await publicDBClient.product.upsert({
		where: { title: recipe.info.title },
		create: {
			title: recipe.info.title,
			fats: productsPFCC_Sum._sum.fats ?? 0,
			protein: productsPFCC_Sum._sum.protein ?? 0,
			calories: productsPFCC_Sum._sum.calories ?? 0,
			carbohydrates: productsPFCC_Sum._sum.carbohydrates ?? 0,
			creatorId: recipe.info.creatorId,
			isRecipePossible: true,
			unit: Units.PORTION,
			isOfficial: true,
			Recipe: {
				create: {
					...recipe.info,
					RecipeComposition: { createMany: { data: recipe.composition } },
				},
			},
		},
		update: {
			Recipe: {
				create: {
					...recipe.info,
					RecipeComposition: { createMany: { data: recipe.composition } },
				},
			},
		},
	})

	return publicDBClient.recipe.findUnique({
		where: { title: recipe.info.title },
	})
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
