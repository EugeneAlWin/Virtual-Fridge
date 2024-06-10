import { publicDBClient } from '@server/prismaClients'

export const _delete = async (id: string) =>
	publicDBClient.checklist.delete({
		where: { id },
	})
