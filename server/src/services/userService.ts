import { createHash } from 'node:crypto'
import { ICreateUserRequest } from '../api/users/dto/createUser'
import { ICreateUserTokenRequest } from '../api/users/dto/createUserToken'
import { IDeleteUsersRequest } from '../api/users/dto/deleteUsers'
import { IDeleteUserTokensRequest } from '../api/users/dto/deleteUserTokens'
import { IGetAllUsersRequest } from '../api/users/dto/getAllUsers'
import { IGetUserByLoginRequest } from '../api/users/dto/getUserByLogin'
import { IGetUserTokensRequest } from '../api/users/dto/getUserTokens'
import { IUpdateUserDataRequest } from '../api/users/dto/updateUserData'
import { IUpdateUserTokenRequest } from '../api/users/dto/updateUserToken'
import UserRequestError from '../errors/userRequestError'
import prismaClient from '../prismaClient'

export default class UserService {
	//get
	static getUserByLogin = async ({ login }: IGetUserByLoginRequest) =>
		prismaClient.user.findUnique({
			where: { login },
			include: { userToken: true },
		})

	static getAllUsers = async ({
		cursor,
		login,
		skip,
		take,
	}: IGetAllUsersRequest) =>
		prismaClient.user.findMany({
			skip,
			take,
			cursor: cursor ? { id: cursor } : undefined,
			where: { login: { contains: login, mode: 'insensitive' } },
			include: { userToken: true },
		})

	static getUserTokens = async ({ userId }: IGetUserTokensRequest) =>
		prismaClient.userToken.findMany({ where: { userId } })

	//create
	static createUser = async ({
		login,
		password,
		role,
	}: ICreateUserRequest) => {
		const user = await prismaClient.user.findUnique({
			where: { login },
			select: { id: true },
		})
		if (user) throw UserRequestError.BadRequest('LOGIN ALREADY TAKEN')

		return prismaClient.user.create({
			data: {
				login,
				role,
				password: createHash('sha512').update(password).digest('hex'),
				store: { create: {} },
			},
			include: { userToken: true },
		})
	}

	static createUserToken = async ({
		deviceId,
		refreshToken,
		userId,
	}: ICreateUserTokenRequest & { refreshToken: string }) => {
		const user = await prismaClient.user.findUnique({
			where: { id: userId },
			select: { id: true },
		})
		if (!user)
			throw UserRequestError.NotFound(`USER WITH ID ${userId} NOT FOUND`)

		const device = await prismaClient.userToken.findUnique({
			where: {
				userId_deviceId: {
					deviceId,
					userId,
				},
			},
			select: { deviceId: true },
		})
		if (device)
			throw UserRequestError.BadRequest(
				`DEVICE ID ${device.deviceId} ALREADY TAKEN`
			)

		return prismaClient.userToken.create({
			data: { refreshToken, deviceId, userId },
		})
	}

	//update
	static updateUserData = async ({
		userId,
		isArchived,
		isBanned,
		login,
		role,
		password,
	}: IUpdateUserDataRequest) => {
		const user = await prismaClient.user.findUnique({
			where: { id: userId },
			select: { id: true },
		})
		if (!user)
			throw UserRequestError.NotFound(`USER WITH ID ${userId} NOT FOUND`)

		return prismaClient.user.update({
			where: { id: userId },
			data: {
				isArchived,
				isBanned,
				login,
				role,
				password: password
					? createHash('sha512').update(password).digest('hex')
					: undefined,
			},
		})
	}

	static updateUserToken = async ({
		userId,
		deviceId,
		refreshToken,
	}: IUpdateUserTokenRequest & { refreshToken: string }) => {
		const user = await prismaClient.user.findUnique({
			where: { id: userId },
			select: { id: true },
		})
		if (!user)
			throw UserRequestError.NotFound(`USER WITH ID ${userId} NOT FOUND`)

		const device = await prismaClient.userToken.findUnique({
			where: { userId_deviceId: { userId, deviceId } },
			select: { deviceId: true },
		})
		if (!device)
			throw UserRequestError.NotFound(`DEVICE WITH ID ${deviceId} NOT FOUND`)

		return prismaClient.userToken.update({
			where: { userId_deviceId: { userId, deviceId } },
			data: { refreshToken },
		})
	}

	//delete
	static deleteUsers = async ({ userIds }: IDeleteUsersRequest) =>
		prismaClient.user.deleteMany({
			where: {
				id: { in: userIds },
			},
		})

	static deleteUserTokens = async ({
		userId,
		devicesId,
	}: IDeleteUserTokensRequest) =>
		prismaClient.userToken.deleteMany({
			where: {
				deviceId: { in: devicesId },
				userId,
			},
		})
}
