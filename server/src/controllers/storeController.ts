import { RequestHandler } from 'express'
import { IErrorResponse } from '../api/errorResponse'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import UserRequestError from '../errors/userRequestError'
import callUnprocessableEntity from '../helpers/callUnprocessableEntity'
import getValidationResult from '../helpers/getValidationResult'
import {
	IGetStoreByUserIdRequest,
	IGetStoreByUserIdResponse,
} from '../api/stores/dto/getStoreById'
import {
	ICreateStoreRequest,
	ICreateStoreResponse,
} from '../api/stores/dto/createStore'
import StoreService from '../services/storeService'
import {
	IUpdateStoreRequest,
	IUpdateStoreResponse,
} from '../api/stores/dto/updateStore'
import {
	IDeleteStoreRequest,
	IDeleteStoreResponse,
} from '../api/stores/dto/deleteStore'

export default class StoreController {
	//get
	static getStoreById: RequestHandler<
		IGetStoreByUserIdRequest,
		IGetStoreByUserIdResponse | IErrorResponse
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await StoreService.getStoreById(req.body)
			res.json({
				...result,
				StoreComposition: result.StoreComposition.map(record => ({
					...record,
					price: record.price.toString(),
				})),
			})
		} catch (e) {
			if ((e as PrismaClientKnownRequestError)?.code === 'P2025') {
				return next(UserRequestError.NotFound('STORE NOT FOUND'))
			}
			return next(e)
		}
	}

	//create
	static createStore: RequestHandler<
		undefined,
		ICreateStoreResponse | IErrorResponse,
		ICreateStoreRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await StoreService.createStore(req.body)
			res.status(201).json({
				...result,
				StoreComposition: result.StoreComposition.map(record => ({
					...record,
					price: record.price.toString(),
				})),
			})
		} catch (e) {
			if ((e as PrismaClientKnownRequestError).code === 'P2003')
				return next(
					UserRequestError.BadRequest(
						`USER WITH ID ${req.body.creatorId} NOT FOUND`
					)
				)
			next(e)
		}
	}

	//update
	static updateStoreData: RequestHandler<
		undefined,
		IUpdateStoreResponse | IErrorResponse,
		IUpdateStoreRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const transactionResult = await StoreService.updateStore(
				req.body
			)
			const updateResult = transactionResult[1]
			res.json({
				...updateResult,
				StoreComposition: updateResult.StoreComposition.map(
					record => ({
						...record,
						price: record.price.toString(),
					})
				),
			})
		} catch (e) {
			if ((e as PrismaClientKnownRequestError).code === 'P2025')
				return next(
					UserRequestError.NotFound(
						`PRODUCT WITH ID ${req.body.id} NOT FOUND`
					)
				)
			next(e)
		}
	}

	//delete
	static deleteStore: RequestHandler<
		undefined,
		IDeleteStoreResponse | IErrorResponse,
		IDeleteStoreRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			await StoreService.deleteStore(req.body)

			res.json({ count: 1 })
		} catch (e) {
			next(e)
		}
	}
}
