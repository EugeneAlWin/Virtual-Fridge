import { RequestHandler } from 'express'
import { createHash } from 'node:crypto'
import { IErrorResponse } from '../api/errorResponse'
import {
	ICreateUserRequest,
	ICreateUserResponse,
} from '../api/users/dto/createUser'
import {
	ICreateUserTokenRequest,
	ICreateUserTokenResponse,
} from '../api/users/dto/createUserToken'
import {
	IDeleteUsersRequest,
	IDeleteUsersResponse,
} from '../api/users/dto/deleteUsers'
import {
	IDeleteUserTokensRequest,
	IDeleteUserTokensResponse,
} from '../api/users/dto/deleteUserTokens'
import {
	IGetAllUsersRequest,
	IGetAllUsersResponse,
} from '../api/users/dto/getAllUsers'
import {
	IGetUserByLoginRequest,
	IGetUserByLoginResponse,
} from '../api/users/dto/getUserByLogin'
import {
	IGetUserTokensRequest,
	IGetUserTokensResponse,
} from '../api/users/dto/getUserTokens'
import {
	ILoginUserRequest,
	ILoginUserRequestCookies,
	ILoginUserResponse,
} from '../api/users/dto/loginUser'
import {
	IUpdateUserDataRequest,
	IUpdateUserDataResponse,
} from '../api/users/dto/updateUserData'
import {
	IUpdateUserTokenRequest,
	IUpdateUserTokenResponse,
} from '../api/users/dto/updateUserToken'
import UserRequestError from '../errors/userRequestError'
import callUnprocessableEntity from '../helpers/callUnprocessableEntity'
import getValidationResult from '../helpers/getValidationResult'
import Tokenizator from '../helpers/tokenizator'
import UserService from '../services/userService'

export default class UserController {
	//login
	static loginUser: RequestHandler<
		undefined,
		ILoginUserResponse | IErrorResponse,
		ILoginUserRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const user = await UserService.getUserByLogin(req.body)
			if (!user)
				return next(
					UserRequestError.NotFound(`USER ${req.body.login} NOT FOUND`)
				)

			if (
				createHash('sha512').update(req.body.password).digest('hex') !==
				user.password
			)
				return next(UserRequestError.BadRequest('WRONG PASSWORD'))

			const { refreshToken, accessToken } = Tokenizator.generateTokens({
				login: user.login,
				role: user.role,
				deviceId: req.body.deviceId,
			})

			const userTokens = await UserService.getUserTokens({ userId: user.id })

			if (userTokens.find(rec => rec.deviceId === req.query.deviceId)) {
				await UserService.updateUserToken({
					userId: user.id,
					deviceId: req.query.deviceId,
					refreshToken,
				} as IUpdateUserTokenRequest & {
					refreshToken: string
				})
			} else
				await UserService.createUserToken({
					deviceId: req.body.deviceId,
					refreshToken,
					userId: user.id,
				} as ICreateUserTokenRequest & {
					refreshToken: string
				})

			res.cookie('refreshToken', refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			}).json({
				userId: user.id,
				refreshToken,
				accessToken,
				login: user.login,
				role: user.role,
				deviceId: req.body.deviceId,
			})
		} catch (e) {
			return next(e)
		}
	}

	//get
	static getUserByLogin: RequestHandler<
		IGetUserByLoginRequest,
		IGetUserByLoginResponse | IErrorResponse
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await UserService.getUserByLogin(req.params)
			if (!result)
				return next(
					UserRequestError.NotFound(
						`USER WITH LOGIN ${req.params.login} NOT FOUND`
					)
				)

			res.json(result)
		} catch (e) {
			return next(e)
		}
	}

	static getAllUsers: RequestHandler<
		undefined,
		IGetAllUsersResponse | IErrorResponse,
		undefined,
		IGetAllUsersRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await UserService.getAllUsers(req.query)
			res.json({
				usersData: result,
				cursor: result[result.length - 1]?.id || null,
			})
		} catch (e) {
			return next(e)
		}
	}

	static getUserTokens: RequestHandler<
		undefined,
		IGetUserTokensResponse[] | IErrorResponse,
		undefined,
		IGetUserTokensRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await UserService.getUserTokens(req.query)
			res.json(result)
		} catch (e) {
			return next(e)
		}
	}

	//create
	static createUser: RequestHandler<
		undefined,
		ICreateUserResponse | IErrorResponse,
		ICreateUserRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await UserService.createUser(req.body)

			res.status(201).json(result)
		} catch (e) {
			return next(e)
		}
	}

	static createUserToken: RequestHandler<
		undefined,
		ICreateUserTokenResponse | IErrorResponse,
		ICreateUserTokenRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const { refreshToken, accessToken } = Tokenizator.generateTokens(
				req.body
			)
			const result = await UserService.createUserToken({
				...req.body,
				refreshToken,
			})

			res.cookie('refreshToken', refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			res.status(201).json({ ...result, accessToken })
		} catch (e) {
			return next(e)
		}
	}

	//update
	static updateUserData: RequestHandler<
		undefined,
		IUpdateUserDataResponse | IErrorResponse,
		IUpdateUserDataRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await UserService.updateUserData(req.body)
			res.json(result)
		} catch (e) {
			return next(e)
		}
	}

	static updateUserToken: RequestHandler<
		undefined,
		IUpdateUserTokenResponse | IErrorResponse,
		IUpdateUserTokenRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const { refreshToken: prevRefreshToken } =
				req.cookies as ILoginUserRequestCookies
			if (!prevRefreshToken) return next(UserRequestError.Unauthorized())

			const user = await UserService.getUserByLogin(req.body)
			const userData = Tokenizator.validateRefreshToken(prevRefreshToken)
			if (!user || !userData) return next(UserRequestError.Unauthorized())

			const { refreshToken, accessToken } = Tokenizator.generateTokens({
				login: user.login,
				role: user.role,
				deviceId: req.body.deviceId,
			})

			const result = await UserService.updateUserToken({
				...req.body,
				refreshToken,
			})
			res.cookie('refreshToken', refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			}).json({ ...result, accessToken })
		} catch (e) {
			return next(e)
		}
	}

	//delete
	static deleteUsers: RequestHandler<
		undefined,
		IDeleteUsersResponse | IErrorResponse,
		IDeleteUsersRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await UserService.deleteUsers(req.body)

			res.json(result)
		} catch (e) {
			return next(e)
		}
	}

	static deleteUserTokens: RequestHandler<
		undefined,
		IDeleteUserTokensResponse | IErrorResponse,
		IDeleteUserTokensRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await UserService.deleteUserTokens(req.body)

			res.json(result)
		} catch (e) {
			return next(e)
		}
	}
}
