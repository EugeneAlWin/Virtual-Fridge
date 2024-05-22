import { publicDBClient } from '@server/prismaClients'
import { CryptoHasher } from 'bun'
import { NotFoundError } from 'elysia'

export const signin = async ({
	userId,
	deviceId,
	password,
}: {
	userId: string
	deviceId: string
	password: string
}) => {
	const user = await publicDBClient.user.findUnique({ where: { id: userId } })

	if (!user) throw new NotFoundError(`User with id ${userId} not found`)
	if (user.isFrozen) throw new Error('Profile frozen')
	if (
		user.password !==
		new CryptoHasher('sha512').update(password).digest('hex')
	)
		throw new Error('Wrong password')

	//TODO: gen tokens
	const refreshToken = ''

	publicDBClient.userToken.upsert({
		where: { userId_deviceId: { userId, deviceId } },
		update: { userId, deviceId, refreshToken },
		create: { userId, deviceId, refreshToken },
	})

	return { refreshToken }
}
