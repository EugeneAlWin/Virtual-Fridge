import { publicDBClient } from '@server/prismaClients'
import { NotFoundError } from 'elysia'

export const confirm = async ({ userId, checklistId }: IConfirm) => {
	const user = await publicDBClient.user.findUnique({
		where: { id: userId },
		select: { id: true, Storage: { select: { id: true } } },
	})
	if (!user) throw new NotFoundError(`USER WITH ID ${userId} NOT FOUND`)

	const productsFromChecklist =
		await publicDBClient.checklistComposition.findMany({
			where: { checklistId },
			select: { productId: true, productQuantity: true },
		})
	const productsFromChecklistMapped = new Map(
		productsFromChecklist.map(i => [i.productId, i.productQuantity])
	)

	const productsFromStorage = await publicDBClient.storageComposition.findMany(
		{
			where: { productId: { in: [...productsFromChecklistMapped.keys()] } },
			select: { productId: true, productQuantity: true },
		}
	)
	const productsFromStorageMapped = new Map(
		productsFromStorage.map(i => [i.productId, i.productQuantity])
	)

	const updatedStoreComposition = productsFromChecklistMapped

	productsFromChecklistMapped.forEach((value, key) => {
		updatedStoreComposition.set(
			key,
			value + (productsFromStorageMapped.get(key) ?? 0)
		)
	})

	return publicDBClient.$transaction(
		[...updatedStoreComposition.entries()].map(([key, value]) =>
			publicDBClient.storageComposition.upsert({
				where: {
					productId: key,
					expireDate_storageId_productId: {
						productId: key,
						storageId: user.Storage?.id || '',
						expireDate: new Date('1970-01-01T00:00:00.00Z'),
					},
				},
				create: {
					productQuantity: value,
					productId: key,
					storageId: user.Storage?.id || '',
				},
				update: { productQuantity: value, productId: key },
			})
		)
	)
}

interface IConfirm {
	checklistId: string
	userId: string
}
