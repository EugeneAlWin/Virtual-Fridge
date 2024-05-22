import { Currencies } from '@prisma/client'
import { publicDBClient } from '@server/prismaClients'
import { NotFoundError } from 'elysia'
import { filter, isTruthy } from 'remeda'

export const update = async (checklist: IUpdate) => {
	const user = await publicDBClient.user.findUnique({
		where: { id: checklist.info.creatorId },
		select: { id: true },
	})
	if (!user)
		throw new NotFoundError(
			`USER WITH ID ${checklist.info.creatorId} NOT FOUND`
		)

	const ops = [
		checklist.composition
			? publicDBClient.checklistComposition.deleteMany({
					where: { checklistId: checklist.info.checklistId },
				})
			: undefined,
		publicDBClient.checklist.update({
			where: { id: checklist.info.checklistId },
			data: {
				ChecklistComposition: checklist.composition
					? { createMany: { data: checklist.composition } }
					: undefined,
				isConfirmed: checklist.info.isConfirmed,
			},
			select: {},
		}),
	]

	await publicDBClient.$transaction(filter(ops, isTruthy))

	return true
}

interface IUpdate {
	composition?: {
		productId: string
		price: number
		currency: Currencies
		productQuantity: number
	}
	info: {
		creatorId: string
		checklistId: string
		isConfirmed?: boolean
	}
}
