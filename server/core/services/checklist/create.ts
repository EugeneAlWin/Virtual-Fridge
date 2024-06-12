import { publicDBClient } from '@server/prismaClients'
import { NotFoundError } from 'elysia'

export const create = async ({
	recipesId,
	subtractStorage,
	userId,
}: ICreate) => {
	const user = await publicDBClient.user.findUnique({
		where: { id: userId },
		select: { id: true },
	})
	if (!user) throw new NotFoundError(`USER WITH ID ${userId} NOT FOUND`)

	const recipes = await publicDBClient.recipeComposition.findMany({
		where: { recipeId: { in: recipesId } },
		select: { recipeId: true, productId: true, quantity: true },
	})

	const productsFromOrigin = new Map(
		recipes.map(i => [i.productId, i.quantity])
	)
	const originProductsId = [...productsFromOrigin.keys()]

	const checklistComposition = productsFromOrigin

	if (subtractStorage) {
		const storageComposition = await publicDBClient.storage.findUnique({
			where: { creatorId: userId },
			select: {
				StorageComposition: {
					where: { productId: { in: originProductsId } },
					select: { productQuantity: true, productId: true },
				},
			},
		})

		if (storageComposition) {
			const productsFromStorage = new Map(
				storageComposition.StorageComposition.map(i => [
					i.productId,
					i.productQuantity,
				])
			)
			productsFromOrigin.forEach((value, key) => {
				const productCount = productsFromStorage.has(key)
					? value - productsFromStorage.get(key)!
					: value
				if (productCount <= 0) return
				checklistComposition.set(key, productCount)
			})
		}
	}

	return publicDBClient.$transaction([
		publicDBClient.selectedRecipeForCooking.createMany({
			data: recipesId.map(i => ({ userId, recipeId: i })),
		}),
		publicDBClient.checklist.create({
			data: {
				creatorId: userId,
				ChecklistComposition: {
					createMany: {
						data: [...checklistComposition.entries()].map(i => ({
							productId: i[0],
							productQuantity: i[1],
						})),
					},
				},
			},
		}),
	])
}

interface ICreate {
	userId: string
	subtractStorage: boolean
	recipesId: string[]
}
