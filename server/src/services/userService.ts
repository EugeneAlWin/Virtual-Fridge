import prismaClient from '../prismaClient'
import { IGetUserByLoginRequest } from '../api/users/dto/getUserByLogin'
import { IGetAllUsersRequest } from '../api/users/dto/getAllUsers'
import { IGetUserTokensRequest } from '../api/users/dto/getUserTokens'
import { ICreateUserRequest } from '../api/users/dto/createUser'
import { ICreateUserTokenRequest } from '../api/users/dto/createUserToken'
import { IUpdateUserDataRequest } from '../api/users/dto/updateUserData'
import { IUpdateUserTokenRequest } from '../api/users/dto/updateUserToken'
import { IDeleteUserTokensRequest } from '../api/users/dto/deleteUserTokens'
import UserRequestError from '../errors/userRequestError'

export default class UserService {
	//get
	static getUserByLogin = async ({
		login,
	}: IGetUserByLoginRequest) =>
		prismaClient.user.findFirstOrThrow({
			where: { login },
			include: { UserToken: true },
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
			include: { UserToken: true },
		})

	static getUserTokens = async ({ userId }: IGetUserTokensRequest) =>
		prismaClient.userToken.findMany({ where: { userId } })

	//create
	static createUser = async ({
		deviceId,
		refreshToken,
		login,
		password,
		role,
	}: ICreateUserRequest) => {
		const result = await prismaClient.user.findUnique({
			where: { login },
		})
		if (result)
			throw UserRequestError.BadRequest('LOGIN ALREADY TAKEN')
		return prismaClient.user.create({
			data: {
				login,
				password,
				role,
				UserToken: {
					create: { deviceId, refreshToken },
				},
			},
			include: { UserToken: true },
		})
	}

	static createUserToken = async ({
		deviceId,
		refreshToken,
		userId,
	}: ICreateUserTokenRequest) => {
		const result = await prismaClient.userToken.findFirst({
			where: {
				userId: userId,
				deviceId: deviceId,
			},
		})
		if (result)
			throw UserRequestError.BadRequest('DEVICE ID ALREADY TAKEN')
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
		password,
	}: IUpdateUserDataRequest) =>
		prismaClient.user.update({
			where: { id: userId },
			data: { isArchived, isBanned, login, password },
		})

	static updateUserToken = async ({
		userId,
		deviceId,
		refreshToken,
	}: IUpdateUserTokenRequest) => {
		const userTokenTable =
			await prismaClient.userToken.findFirstOrThrow({
				where: { userId },
			})
		return prismaClient.userToken.update({
			where: { deviceId, id: userTokenTable.id },
			data: { refreshToken },
		})
	}

	//delete
	static deleteUserTokens = async ({
		userId,
		deviceId,
	}: IDeleteUserTokensRequest) =>
		prismaClient.userToken.deleteMany({
			where: {
				deviceId: { in: deviceId },
				User: { id: userId },
			},
		})
}
