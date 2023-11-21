import { ICreateStoreRequest } from '../api/stores/dto/createStore'
import { IDeleteStoreRequest } from '../api/stores/dto/deleteStore'
import { IGetStoreByUserIdRequest } from '../api/stores/dto/getStoreByUserId'
import { IUpdateStoreRequest } from '../api/stores/dto/updateStore'
import UserRequestError from '../errors/userRequestError'
import prismaClient from '../prismaClient'

export default class StoreService {
	//get
	static getStoreById = async ({ creatorId }: IGetStoreByUserIdRequest) =>
		prismaClient.store.findUnique({
			where: { creatorId },
			include: { storeComposition: true },
		})

	//create
	static createStore = async ({
		title,
		creatorId,
		storeComposition,
	}: ICreateStoreRequest) => {
		const user = await prismaClient.user.findUnique({
			where: { id: creatorId },
			select: { id: true },
		})

		if (!user)
			throw UserRequestError.NotFound(`USER WITH ID ${creatorId} NOT FOUND`)

		const store = await prismaClient.store.findUnique({
			where: { creatorId },
			select: { id: true },
		})

		if (store)
			throw UserRequestError.BadRequest(
				`STORE FOR USER WITH ID ${creatorId} ALREADY EXISTS`
			)

		const productsCount = await prismaClient.product.count({
			where: {
				id: { in: storeComposition.map(rec => rec.productId) },
			},
		})

		if (productsCount !== storeComposition.length)
			throw UserRequestError.NotFound('UNKNOWN PRODUCT ID GIVEN')

		return prismaClient.store.create({
			data: {
				title,
				creatorId,
				storeComposition: {
					createMany: {
						data: storeComposition.map(record => ({
							productId: record.productId,
							quantity: record.quantity,
							expires: record.expires,
							price: record.price,
							currency: record.currency,
							unit: record.unit,
						})),
					},
				},
			},
			include: { storeComposition: true },
		})
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
						data: storeComposition,
					},
				},
			},
			include: { storeComposition: true },
		})
	}

	//delete
	static deleteStore = async ({ creatorId, storeId }: IDeleteStoreRequest) => {
		const store = await prismaClient.store.findUnique({
			where: { id: storeId },
			select: { id: true },
		})

		if (!store)
			throw UserRequestError.NotFound(
				`STORE WITH ID ${storeId} AND USER ID ${creatorId} NOT FOUND`
			)

		return prismaClient.store.delete({
			where: { id: storeId },
		})
	}
}
