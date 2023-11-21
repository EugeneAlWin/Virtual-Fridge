import { RequestHandler } from 'express'
import { IErrorResponse } from '../api/errorResponse'
import UserRequestError from '../errors/userRequestError'
import callUnprocessableEntity from '../helpers/callUnprocessableEntity'
import getValidationResult from '../helpers/getValidationResult'
import {
	IGetStoreByUserIdRequest,
	IGetStoreByUserIdResponse,
} from '../api/stores/dto/getStoreByUserId'
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
		undefined,
		IGetStoreByUserIdResponse | IErrorResponse,
		IGetStoreByUserIdRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await StoreService.getStoreById(req.body)
			if (!result)
				return next(
					UserRequestError.NotFound(
						`STORE WITH CREATOR_ID ${req.body.creatorId} NOT FOUND`
					)
				)

			res.json({
				...result,
				storeComposition: result.storeComposition.map(record => ({
					...record,
					price: record.price.toNumber(),
				})),
			})
		} catch (e) {
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
				storeComposition: result.storeComposition.map(record => ({
					...record,
					price: record.price.toNumber(),
				})),
			})
		} catch (e) {
			return next(e)
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
			const transactionResult = await StoreService.updateStore(req.body)
			const updateResult = transactionResult[1]
			res.json({
				...updateResult,
				storeComposition: updateResult.storeComposition.map(record => ({
					...record,
					price: record.price.toNumber(),
				})),
			})
		} catch (e) {
			return next(e)
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
			return next(e)
		}
	}
}
