import prismaClient from '../prismaClient'
import { IGetStoreByUserIdRequest } from '../api/stores/dto/getStoreById'
import { IUpdateStoreRequest } from '../api/stores/dto/updateStore'
import { IDeleteStoreRequest } from '../api/stores/dto/deleteStore'
import { ICreateStoreRequest } from '../api/stores/dto/createStore'
import UserRequestError from '../errors/userRequestError'

export default class StoreService {
	//get
	static getStoreById = async ({
		creatorId,
	}: IGetStoreByUserIdRequest) =>
		prismaClient.store.findFirstOrThrow({
			where: { creatorId },
			include: { StoreComposition: true },
		})

	//create
	static createStore = async ({
		title,
		creatorId,
		StoreComposition,
	}: ICreateStoreRequest) => {
		const user = await prismaClient.user.findUnique({
			where: { id: creatorId },
		})

		if (!user) throw UserRequestError.NotFound('USER NOT FOUND')

		const store = await prismaClient.store.findUnique({
			where: { creatorId },
		})

		if (store)
			throw UserRequestError.BadRequest(
				`STORE FOR USER WITH ID ${creatorId} ALREADY EXISTS`
			)
		console.log(store)
		return prismaClient.store.create({
			data: {
				title,
				creatorId,
				StoreComposition: {
					createMany: {
						data: StoreComposition.map(record => ({
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
			include: { StoreComposition: true },
		})
	}

	//update
	static updateStore = async ({
		id,
		creatorId,
		title,
		StoreComposition,
	}: IUpdateStoreRequest) => {
		const user = await prismaClient.user.findUnique({
			where: { id: creatorId },
		})
		if (!user) throw UserRequestError.NotFound('USER NOT FOUND')

		const store = await prismaClient.store.findUnique({
			where: { id },
		})
		if (!store) throw UserRequestError.NotFound('STORE NOT FOUND')

		return prismaClient.$transaction([
			prismaClient.storeComposition.deleteMany({
				where: { storeId: id },
			}),
			prismaClient.store.update({
				where: { id },
				data: {
					title,
					StoreComposition: {
						createMany: {
							data: StoreComposition.map(record => ({
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
				include: { StoreComposition: true },
			}),
		])
	}

	//delete
	static deleteStore = async ({
		creatorId,
		storeId,
	}: IDeleteStoreRequest) => {
		const store = await prismaClient.store.findUnique({
			where: { creatorId, id: storeId },
		})

		if (!store)
			throw UserRequestError.NotFound(
				`STORE WITH ID ${storeId} AND USER ID ${creatorId} NOT FOUND`
			)

		return prismaClient.$transaction([
			prismaClient.storeComposition.deleteMany({
				where: { storeId: storeId },
			}),
			prismaClient.store.delete({
				where: { id: storeId, creatorId },
			}),
		])
	}
}
