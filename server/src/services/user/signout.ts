import { publicDBClient } from '@server/prismaClients'

export const signout = async (userId_deviceId: {
	userId: string
	deviceId: string
}) =>
	publicDBClient.userToken.delete({
		where: { userId_deviceId },
	})
