import { RequestHandler } from 'express'
import { IErrorResponse } from '../api/errorResponse'
import {
	ICreateStoreRequest,
	ICreateStoreResponse,
} from '../api/stores/dto/createStore'
import {
	IDeleteStoreRequest,
	IDeleteStoreResponse,
} from '../api/stores/dto/deleteStore'
import {
	IGetStoreByUserIdRequest,
	IGetStoreByUserIdResponse,
} from '../api/stores/dto/getStoreByUserId'
import {
	IUpdateStoreRequest,
	IUpdateStoreResponse,
} from '../api/stores/dto/updateStore'
import UserRequestError from '../errors/userRequestError'
import callUnprocessableEntity from '../helpers/callUnprocessableEntity'
import getValidationResult from '../helpers/getValidationResult'
import StoreService from '../services/storeService'

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
			const result = await StoreService.updateStore(req.body)
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
