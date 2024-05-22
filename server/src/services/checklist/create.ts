import { Currencies } from '@prisma/client'
import { publicDBClient } from '@server/prismaClients'
import { NotFoundError } from 'elysia'

export const create = async (checklist: ICreate) => {
	const user = await publicDBClient.user.findUnique({
		where: { id: checklist.info.creatorId },
		select: { id: true },
	})
	if (!user)
		throw new NotFoundError(
			`USER WITH ID ${checklist.info.creatorId} NOT FOUND`
		)

	await publicDBClient.checklist.create({
		data: {
			ChecklistComposition: { createMany: { data: checklist.composition } },
			creatorId: checklist.info.creatorId,
			isConfirmed: checklist.info.isConfirmed,
		},
		select: {},
	})

	return true
}

interface ICreate {
	composition: {
		productId: string
		price: number
		currency: Currencies
		productQuantity: number
	}
	info: {
		creatorId: string
		isConfirmed?: boolean
	}
}
