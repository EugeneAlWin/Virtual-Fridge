import { publicDBClient } from '@server/prismaClients'

export const _delete = async (id: string) =>
	publicDBClient.recipe.delete({
		where: { id },
	})
