import { publicDBClient } from '@server/prismaClients'

export const getOne = (login: string) =>
	publicDBClient.user.findUnique({
		where: { login },
		include: { Storage: true },
	})
