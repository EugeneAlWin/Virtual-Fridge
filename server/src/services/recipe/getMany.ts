import { publicDBClient } from '@server/prismaClients'

export const getMany = async (ids: string[]) =>
	publicDBClient.recipe.findMany({
		where: { id: { in: ids } },
	})
