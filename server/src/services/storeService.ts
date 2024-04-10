import { IUpdateStoreRequest } from '../api/stores/dto/updateStore'
import UserRequestError from '../errors/userRequestError'
import prismaClient from '../prismaClient'

export default class StoreService {
	//get
	static getStoreById = async (creatorId: number) => {
		const store = await prismaClient.store.findUnique({
			where: { creatorId },
			include: { storeComposition: true },
		})
		if (!store)
			throw UserRequestError.NotFound(
				`STORE WITH CREATOR_ID ${creatorId} NOT FOUND`
			)

		const productIds = store.storeComposition.map(
			product => product.productId
		)

		const products = await prismaClient.product.findMany({
			where: { id: { in: productIds } },
		})

		return {
			...store,
			storeComposition: store.storeComposition.map(product => ({
				...product,
				storeId: undefined,
				productId: undefined,
				product: products.find(item => item.id === product.productId),
				price: product.price.toNumber(),
			})),
		}
	}

	//update
	static updateStore = async ({
		id,
		creatorId,
		title,
		storeComposition,
	}: IUpdateStoreRequest) => {
		if (
			new Set(storeComposition?.map(rec => `productId${rec.productId}`))
				.size !== storeComposition?.length
		)
			throw UserRequestError.BadRequest('PRODUCT DUPLICATES')

		const user = await prismaClient.user.findUnique({
			where: { id: creatorId },
			select: { id: true },
		})
		if (!user)
			throw UserRequestError.NotFound(`USER WITH ID ${creatorId} NOT FOUND`)

		const store = await prismaClient.store.findUnique({
			where: { id },
			select: { id: true },
		})
		if (!store)
			throw UserRequestError.NotFound(`STORE WITH ID ${id} NOT FOUND`)

		const productsCount = await prismaClient.product.count({
			where: {
				id: { in: storeComposition.map(rec => rec.productId) },
			},
		})

		if (productsCount !== storeComposition.length)
			throw UserRequestError.NotFound('UNKNOWN PRODUCT ID')

		return prismaClient.store.update({
			where: { id },
			data: {
				title,
				storeComposition: {
					deleteMany: { storeId: { equals: id } },
					createMany: {
						data: storeComposition.map(item => ({
							...item,
							expires: item.expires
								? new Date(item.expires).toISOString()
								: undefined,
						})),
					},
				},
			},
			include: { storeComposition: true },
		})
	}
}
