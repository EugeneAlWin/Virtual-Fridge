import { RequestHandler } from 'express'
import { IErrorResponse } from '../api/errorResponse'
import {
	IUpdateStoreRequest,
	IUpdateStoreResponse,
} from '../api/stores/dto/updateStore'
import callUnprocessableEntity from '../helpers/callUnprocessableEntity'
import getValidationResult from '../helpers/getValidationResult'
import StoreService from '../services/storeService'

export default class StoreController {
	//get
	static getStoreById = async (creatorId: number) => {
		const res = await StoreService.getStoreById(creatorId)
		throw new Error('zalups')
		return res.storeComposition
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
