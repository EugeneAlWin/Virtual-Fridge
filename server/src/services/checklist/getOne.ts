import { publicDBClient } from '@server/prismaClients'

export const getOne = async (id: string) =>
	publicDBClient.checklist.findUnique({ where: { id } })
