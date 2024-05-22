import { publicDBClient } from '@server/prismaClients'

export const getOne = async (login: string) =>
	publicDBClient.user.findUnique({
		where: { login },
	})
