import { publicDBClient } from '@server/prismaClients'

export const getMany = async (ids: string[]) =>
	publicDBClient.product.findMany({
		where: { id: { in: ids } },
	})
