import { publicDBClient } from '@server/prismaClients'

export const signout = async ({
	userId,
	deviceId,
}: {
	userId: string
	deviceId: string
}) =>
	publicDBClient.userToken.delete({
		where: { userId_deviceId: { userId, deviceId } },
	})
