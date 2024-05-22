import { publicDBClient } from '@server/prismaClients'

export const getOne = async (id: string) =>
	publicDBClient.recipe.findUnique({
		where: { id },
	})
