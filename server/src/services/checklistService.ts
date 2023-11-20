import { ICreateChecklistRequest } from '../api/checklists/dto/createChecklist'
import { IDeleteChecklistRequest } from '../api/checklists/dto/deleteChecklist'
import { IGetAllChecklistsRequest } from '../api/checklists/dto/getAllChecklists'
import { IGetChecklistByIdRequest } from '../api/checklists/dto/getChecklistById'
import { IUpdateChecklistRequest } from '../api/checklists/dto/updateChecklist'
import UserRequestError from '../errors/userRequestError'
import prismaClient from '../prismaClient'

export default class ChecklistService {
	//get
	static getChecklistById = async ({ id }: IGetChecklistByIdRequest) =>
		prismaClient.checklist.findUnique({
			where: { id },
			include: {
				checklistComposition: true,
				checklistPrices: true,
			},
		})

	static getAllChecklists = async ({
		cursor,
		skip,
		take,
		createdAt,
		creatorId,
	}: IGetAllChecklistsRequest) =>
		prismaClient.checklist.findMany({
			skip,
			take,
			cursor: cursor ? { id: cursor } : undefined,
			where: {
				creatorId,
				createdAt: createdAt ? { lte: createdAt } : undefined,
			},
			include: {
				checklistComposition: true,
				checklistPrices: true,
			},
			orderBy: { createdAt: 'desc' },
		})

	//create
	static createChecklist = async ({
		creatorId,
		checklistComposition,
		checklistPrices,
	}: ICreateChecklistRequest) => {
		const user = await prismaClient.user.findUnique({
			where: { id: creatorId },
			select: { id: true },
		})

		if (!user)
			throw UserRequestError.NotFound(
				`USER WITH ID ${creatorId} DOES NOT EXISTS`
			)

		const products = await prismaClient.product.findMany({
			where: {
				id: {
					in: checklistComposition.map(record => record.productId),
				},
			},
		})

		if (checklistComposition.length !== products.length)
			throw UserRequestError.NotFound('SOME PRODUCT DOES NOT EXISTS')

		return prismaClient.checklist.create({
			data: {
				creatorId,
				checklistComposition: {
					createMany: {
						data: checklistComposition.map(record => ({
							productId: record.productId,
							quantity: record.quantity,
							currency: record.currency,
							price: record.price,
							units: record.units,
						})),
					},
				},
				checklistPrices: {
					create: {
						BYN: checklistPrices.BYN,
						RUB: checklistPrices.RUB,
						USD: checklistPrices.USD,
					},
				},
			},
			include: {
				checklistComposition: true,
				checklistPrices: true,
			},
		})
	}

	//update
	static updateChecklist = async ({
		checklistId,
		isConfirmed,
		checklistComposition,
		checklistPrices,
	}: IUpdateChecklistRequest) => {
		const checklist = await prismaClient.checklist.findUnique({
			where: { id: checklistId },
			select: { id: true },
		})

		if (!checklist)
			throw UserRequestError.NotFound(
				`CHECKLIST WITH ID ${checklistId} DOES NOT EXISTS`
			)

		if (!!checklistComposition !== !!checklistPrices)
			throw UserRequestError.BadRequest(
				'CHECKLIST COMPOSITION AND CHECKLIST PRICES MUST GO TOGETHER'
			)
		const transactions = []
		if (checklistComposition && checklistPrices)
			transactions.push(
				prismaClient.checklistComposition.deleteMany({
					where: { checklistId },
				}),
				prismaClient.checklistComposition.createMany({
					data: checklistComposition.map(record => ({
						productId: record.productId,
						quantity: record.quantity,
						currency: record.currency,
						price: record.price,
						units: record.units,
						checklistId,
					})),
				}),
				prismaClient.checklistPrices.delete({
					where: { checklistId },
				}),
				prismaClient.checklistPrices.create({
					data: {
						BYN: checklistPrices.BYN,
						RUB: checklistPrices.RUB,
						USD: checklistPrices.USD,
						checklistId,
					},
				})
			)
		if (isConfirmed !== undefined)
			transactions.push(
				prismaClient.checklist.update({
					where: { id: checklistId },
					data: { isConfirmed },
				})
			)
		if (transactions.length > 0) await prismaClient.$transaction(transactions)

		return prismaClient.checklist.findUnique({
			where: { id: checklistId },
			include: {
				checklistComposition: true,
				checklistPrices: true,
			},
		})
	}

	//delete
	static deleteChecklist = async ({
		creatorId,
		checklistsId,
	}: IDeleteChecklistRequest) =>
		prismaClient.checklist.deleteMany({
			where: {
				creatorId,
				id: { in: checklistsId },
			},
		})
}
