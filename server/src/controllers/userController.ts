import { RequestHandler } from 'express'
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
import UserService from '../services/userService'
import Tokenizator from '../helpers/tokenizator'
import {
	IDeleteUsersRequest,
	IDeleteUsersResponse,
} from '../api/users/dto/deleteUsers'

export default class UserController {
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
		IGetAllUsersRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await UserService.getAllUsers(req.body)
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
		IGetUserTokensRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await UserService.getUserTokens(req.body)
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
			const { refreshToken, accessToken } = Tokenizator.generateTokens(
				req.body
			)
			const result = await UserService.createUser({
				...req.body,
				refreshToken,
			})

			res.cookie('accessToken', accessToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
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

			res.cookie('accessToken', accessToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			res.status(201).json(result)
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
			const { refreshToken, accessToken } = Tokenizator.generateTokens(
				req.body
			)

			const result = await UserService.updateUserToken({
				...req.body,
				refreshToken,
			})
			res.cookie('accessToken', accessToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})

			res.json(result)
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
