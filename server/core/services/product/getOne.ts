import { publicDBClient } from '@server/prismaClients'

export const getOne = async (id: string) =>
	publicDBClient.product.findUnique({
		where: { id },
	})
