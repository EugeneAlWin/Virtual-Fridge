import { publicDBClient } from '@server/prismaClients'
import { Roles } from '~shared/enums'

export const create = async ({
	login,
	password,
	role,
	isBlocked,
	isFrozen,
	deviceId,
}: {
	login: string
	password: string
	role: Roles
	isBlocked?: boolean
	isFrozen?: boolean
	deviceId: string
}) =>
	publicDBClient.user.create({
		data: {
			login,
			role,
			password: new Bun.CryptoHasher('sha512')
				.update(password)
				.digest('hex'),
			isBlocked,
			isFrozen,
			UserToken: { create: { refreshToken: 'genTokenHere', deviceId } },
			Storage: { create: {} },
		},
	})
