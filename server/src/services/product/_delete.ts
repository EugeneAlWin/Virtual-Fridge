import { publicDBClient } from '@server/prismaClients'

export const _delete = async (id: string) =>
	publicDBClient.product.delete({
		where: { id },
		select: {},
	})
