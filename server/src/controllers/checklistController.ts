import { RequestHandler } from 'express'
import {
	IGetChecklistByIdRequest,
	IGetChecklistByIdResponse,
} from '../api/checklists/dto/getChecklistById'
import getValidationResult from '../helpers/getValidationResult'
import callUnprocessableEntity from '../helpers/callUnprocessableEntity'
import ChecklistService from '../services/checklistService'
import UserRequestError from '../errors/userRequestError'
import {
	IGetAllChecklistsRequest,
	IGetAllChecklistsResponse,
} from '../api/checklists/dto/getAllChecklists'
import {
	ICreateChecklistRequest,
	ICreateChecklistResponse,
} from '../api/checklists/dto/createChecklist'
import {
	IUpdateChecklistRequest,
	IUpdateChecklistResponse,
} from '../api/checklists/dto/updateChecklist'
import {
	IDeleteChecklistsRequest,
	IDeleteChecklistsResponse,
} from '../api/checklists/dto/deleteChecklist'
import { IErrorResponse } from '../api/errorResponse'

export default class ChecklistController {
	//get
	static getChecklistById: RequestHandler<
		undefined,
		IGetChecklistByIdResponse | IErrorResponse,
		undefined,
		IGetChecklistByIdRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await ChecklistService.getChecklistById(req.query)
			if (!result)
				return next(
					UserRequestError.NotFound(
						`CHECKLIST WITH ID ${req.query.id} NOT FOUND`
					)
				)

			res.json({
				...result,
				checklistComposition: result.checklistComposition.map(record => ({
					...record,
					price: record.price.toNumber(),
				})),
				checklistPrices: {
					checklistId: result.checklistPrices?.checklistId || result.id,
					BYN: result.checklistPrices?.BYN.toNumber() || null,
					USD: result.checklistPrices?.USD.toNumber() || null,
					RUB: result.checklistPrices?.RUB.toNumber() || null,
				},
			})
		} catch (e) {
			return next(e)
		}
	}

	static getAllChecklists: RequestHandler<
		undefined,
		IGetAllChecklistsResponse | IErrorResponse,
		undefined,
		IGetAllChecklistsRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await ChecklistService.getAllChecklists(req.query)
			res.json({
				checklistsData: result.map(record => ({
					...record,
					checklistPrices: {
						checklistId: record.checklistPrices?.checklistId || record.id,
						BYN: record.checklistPrices?.BYN.toNumber() || null,
						USD: record.checklistPrices?.USD.toNumber() || null,
						RUB: record.checklistPrices?.RUB.toNumber() || null,
					},
					checklistComposition: record.checklistComposition.map(item => ({
						...item,
						checklistId: item.checklistId,
						price: item.price?.toNumber() || 0,
					})),
				})),
				cursor: result[result.length - 1]?.id || null,
			})
		} catch (e) {
			return next(e)
		}
	}

	//create
	static createChecklist: RequestHandler<
		undefined,
		ICreateChecklistResponse | IErrorResponse,
		ICreateChecklistRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await ChecklistService.createChecklist(req.body)
			res.status(201).json({
				...result,
				checklistComposition: result.checklistComposition.map(record => ({
					...record,
					price: record.price.toNumber(),
				})),
				checklistPrices: {
					checklistId: result.checklistPrices?.checklistId || result.id,
					BYN: result.checklistPrices?.BYN.toNumber() || null,
					USD: result.checklistPrices?.USD.toNumber() || null,
					RUB: result.checklistPrices?.RUB.toNumber() || null,
				},
			})
		} catch (e) {
			return next(e)
		}
	}

	//update
	static updateChecklist: RequestHandler<
		undefined,
		IUpdateChecklistResponse | IErrorResponse,
		IUpdateChecklistRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await ChecklistService.updateChecklist(req.body)
			if (!result)
				return next(
					UserRequestError.NotFound(
						`CHECKLIST WITH ID ${req.body.checklistId} NOT FOUND`
					)
				)

			res.json({
				...result,
				checklistComposition: result.checklistComposition.map(record => ({
					...record,
					price: record.price.toNumber(),
				})),
				checklistPrices: {
					checklistId: result.checklistPrices?.checklistId || result.id,
					BYN: result.checklistPrices?.BYN.toNumber() || null,
					USD: result.checklistPrices?.USD.toNumber() || null,
					RUB: result.checklistPrices?.RUB.toNumber() || null,
				},
			})
		} catch (e) {
			return next(e)
		}
	}

	//delete
	static deleteChecklists: RequestHandler<
		undefined,
		IDeleteChecklistsResponse | IErrorResponse,
		IDeleteChecklistsRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await ChecklistService.deleteChecklist(req.body)

			res.json(result)
		} catch (e) {
			return next(e)
		}
	}
}
