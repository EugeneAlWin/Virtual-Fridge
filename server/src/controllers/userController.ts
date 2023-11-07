import { RequestHandler } from 'express'
import UserService from '../services/userService'
import {
	IGetUserByLoginRequest,
	IGetUserByLoginResponse,
} from '../api/users/dto/getUserByLogin'
import { IErrorResponse } from '../api/errorResponse'
import {
	IGetAllUsersRequest,
	IGetAllUsersResponse,
} from '../api/users/dto/getAllUsers'
import {
	IGetUserTokensRequest,
	IGetUserTokensResponse,
} from '../api/users/dto/getUserTokens'
import {
	ICreateUserRequest,
	ICreateUserResponse,
} from '../api/users/dto/createUser'
import {
	ICreateUserTokenRequest,
	ICreateUserTokenResponse,
} from '../api/users/dto/createUserToken'
import {
	IUpdateUserDataRequest,
	IUpdateUserDataResponse,
} from '../api/users/dto/updateUserData'
import {
	IUpdateUserTokenRequest,
	IUpdateUserTokenResponse,
} from '../api/users/dto/updateUserToken'
import {
	IDeleteUserTokensRequest,
	IDeleteUserTokensResponse,
} from '../api/users/dto/deleteUserTokens'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import UserRequestError from '../errors/userRequestError'
import callUnprocessableEntity from '../helpers/callUnprocessableEntity'
import getValidationResult from '../helpers/getValidationResult'

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
			res.json(result as IGetUserByLoginResponse)
		} catch (e) {
			if ((e as PrismaClientKnownRequestError)?.code === 'P2025') {
				return next(UserRequestError.NotFound('USER NOT FOUND'))
			}
			return next(e)
		}
	}

	static getAllUsers: RequestHandler<
		undefined,
		IGetAllUsersResponse[] | IErrorResponse,
		IGetAllUsersRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await UserService.getAllUsers(req.body)
			res.json(result as IGetAllUsersResponse[])
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
			res.json(result as IGetUserTokensResponse[])
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
			res.status(201).json(result as ICreateUserResponse)
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
			res.status(201).json(result as ICreateUserTokenResponse)
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
			res.json(result as IUpdateUserDataResponse)
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
			res.json(result as IUpdateUserTokenResponse)
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

			res.json(result as IDeleteUserTokensResponse)
		} catch (e) {
			next(e)
		}
	}
}
