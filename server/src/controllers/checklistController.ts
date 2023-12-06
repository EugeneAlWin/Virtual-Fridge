import { RequestHandler } from 'express'
import {
	ICreateChecklistRequest,
	ICreateChecklistResponse,
} from '../api/checklists/dto/createChecklist'
import {
	IDeleteChecklistsRequest,
	IDeleteChecklistsResponse,
} from '../api/checklists/dto/deleteChecklist'
import {
	IGetAllChecklistsPreviewRequest,
	IGetAllChecklistsPreviewResponse,
} from '../api/checklists/dto/getAllChecklists'
import {
	IGetChecklistByIdRequest,
	IGetChecklistByIdResponse,
} from '../api/checklists/dto/getChecklistById'
import {
	IUpdateChecklistRequest,
	IUpdateChecklistResponse,
} from '../api/checklists/dto/updateChecklist'
import { IErrorResponse } from '../api/errorResponse'
import UserRequestError from '../errors/userRequestError'
import callUnprocessableEntity from '../helpers/callUnprocessableEntity'
import getValidationResult from '../helpers/getValidationResult'
import ChecklistService from '../services/checklistService'

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

			res.json(result)
		} catch (e) {
			return next(e)
		}
	}

	static getAllChecklistsPreview: RequestHandler<
		undefined,
		IGetAllChecklistsPreviewResponse | IErrorResponse,
		undefined,
		IGetAllChecklistsPreviewRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await ChecklistService.getAllChecklistsPreview(
				req.query
			)
			res.json({
				checklistsData: result.map(record => ({
					...record,
					checklistPrices: {
						BYN: record.checklistPrices?.BYN.toNumber() || null,
						USD: record.checklistPrices?.USD.toNumber() || null,
						RUB: record.checklistPrices?.RUB.toNumber() || null,
					},
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
