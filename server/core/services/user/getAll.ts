import { publicDBClient } from '@server/prismaClients'

export const getAll = async ({
	take = 25,
	cursor,
	login,
}: {
	cursor?: string | null
	login?: string
	take?: number
}) => {
	const users = await publicDBClient.user.findMany({
		skip: cursor ? 1 : 0,
		take,
		cursor: cursor ? { id: cursor } : undefined,
		where: {
			login: login ? { contains: login, mode: 'insensitive' } : undefined,
		},
	})

	return { users, cursor: users.at(-1)?.id ?? null }
}
