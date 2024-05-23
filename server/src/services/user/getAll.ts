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
		take,
		cursor: cursor ? { id: cursor } : undefined,
		where: { login: { contains: login, mode: 'insensitive' } },
	})

	return { users, cursor: users.at(-1) ?? null }
}
