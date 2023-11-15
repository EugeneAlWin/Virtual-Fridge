import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
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
			res.json(result)
		} catch (e) {
			if ((e as PrismaClientKnownRequestError)?.code === 'P2025') {
				return next(UserRequestError.NotFound('USER NOT FOUND'))
			}
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
			next(e)
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
			next(e)
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
			const result = await UserService.createUserToken(req.body)
			res.status(201).json(result)
		} catch (e) {
			if ((e as PrismaClientKnownRequestError).code === 'P2003')
				return next(
					UserRequestError.NotFound(
						`USER WITH ID ${req.body.userId} NOT FOUND`
					)
				)
			next(e)
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
			if ((e as PrismaClientKnownRequestError).code === 'P2025')
				return next(
					UserRequestError.NotFound(
						`USER WITH ID ${req.body.userId} NOT FOUND`
					)
				)
			next(e)
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
			const result = await UserService.updateUserToken(req.body)
			res.json(result)
		} catch (e) {
			if ((e as PrismaClientKnownRequestError)?.code === 'P2025') {
				return next(
					UserRequestError.NotFound('DEVICE OR USER NOT FOUND')
				)
			}
			next(e)
		}
	}

	//delete
	static deleteUserTokens: RequestHandler<
		undefined,
		IDeleteUserTokensResponse | IErrorResponse,
		IDeleteUserTokensRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await UserService.deleteUserTokens(req.body)

			if (result.count === 0)
				return next(
					UserRequestError.NotFound('NO DEVICES WERE FOUND')
				)

			res.json(result)
		} catch (e) {
			next(e)
		}
	}
}
