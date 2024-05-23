import { Roles } from '@prisma/client'
import { publicDBClient } from '@server/prismaClients'

export const update = async ({
	id,
	login,
	password,
	role,
	isBlocked,
	isFrozen,
}: {
	id: string
	login?: string
	password?: string
	role?: Roles
	isBlocked?: boolean
	isFrozen?: boolean
}) =>
	publicDBClient.user.update({
		where: { id },
		data: {
			login,
			role,
			password: password
				? new Bun.CryptoHasher('sha512').update(password).digest('hex')
				: undefined,
			isBlocked,
			isFrozen,
		},
	})
