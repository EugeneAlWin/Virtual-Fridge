import { publicDBClient } from '@server/prismaClients'

export const _delete = (id: string) =>
	publicDBClient.user.delete({ where: { id } })
