import { publicDBClient } from '@server/prismaClients'

export const getMany = async (ids: string[]) =>
	publicDBClient.checklist.findMany({
		where: { id: { in: ids } },
	})
