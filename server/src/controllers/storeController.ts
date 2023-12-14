import { RequestHandler } from 'express'
import { IErrorResponse } from '../api/errorResponse'
import {
	IGetStoreByUserIdRequest,
	IGetStoreByUserIdResponse,
} from '../api/stores/dto/getStoreByUserId'
import {
	IUpdateStoreRequest,
	IUpdateStoreResponse,
} from '../api/stores/dto/updateStore'
import callUnprocessableEntity from '../helpers/callUnprocessableEntity'
import getValidationResult from '../helpers/getValidationResult'
import StoreService from '../services/storeService'

export default class StoreController {
	//get
	static getStoreById: RequestHandler<
		undefined,
		IGetStoreByUserIdResponse | IErrorResponse,
		undefined,
		IGetStoreByUserIdRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await StoreService.getStoreById(req.query)

			res.json(result)
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
}
