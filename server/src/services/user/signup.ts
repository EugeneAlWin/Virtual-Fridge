import { Roles } from '@prisma/client'
import { publicDBClient } from '@server/prismaClients'
import { NotFoundError } from 'elysia'
import TokensCore from 'server/utils/tokensCore'

export const signup = async ({
	login,
	deviceId,
	password,
	role,
	isBlocked,
	isFrozen,
}: {
	login: string
	deviceId: string
	password: string
	role?: Roles
	isBlocked?: boolean
	isFrozen?: boolean
}) => {
	const user = await publicDBClient.user.findUnique({ where: { login } })

	if (user) throw new NotFoundError(`User with login ${login} already exists`)

	const { refreshToken, accessToken } = TokensCore.generateTokens({
		login,
		role,
		deviceId,
	})

	const newUser = await publicDBClient.user.create({
		data: {
			login,
			role,
			password: new Bun.CryptoHasher('sha512')
				.update(password)
				.digest('hex'),
			isBlocked,
			isFrozen,
			UserToken: { create: { refreshToken, deviceId } },
			Storage: { create: {} },
		},
	})

	return {
		refreshToken,
		accessToken,
		user: { ...newUser, deviceId },
	}
}
