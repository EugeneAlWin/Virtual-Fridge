import { publicDBClient } from '@server/prismaClients'
import TokensCore from '@shared/utils/tokensCore'
import { NotFoundError } from 'elysia'

export const signin = async ({
	login,
	deviceId,
	password,
}: {
	login: string
	deviceId: string
	password: string
}) => {
	const user = await publicDBClient.user.findUnique({
		where: { login },
		include: { Storage: { select: { id: true } } },
	})

	if (!user) throw new NotFoundError(`User with login ${login} not found`)
	if (user.isFrozen) throw new Error('Profile frozen')
	if (
		user.password !==
		new Bun.CryptoHasher('sha512').update(password).digest('hex')
	)
		throw new Error('Wrong password')

	const { refreshToken, accessToken } = TokensCore.generateTokens({
		login,
		role: user.role,
		deviceId,
	})

	await publicDBClient.userToken.upsert({
		where: { userId_deviceId: { userId: user.id, deviceId } },
		update: { userId: user.id, deviceId, refreshToken },
		create: { userId: user.id, deviceId, refreshToken },
	})

	return { refreshToken, accessToken, user: { ...user, deviceId } }
}
