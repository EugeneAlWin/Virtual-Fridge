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
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import {
	IDeleteChecklistRequest,
	IDeleteChecklistResponse,
} from '../api/checklists/dto/deleteChecklist'
import { IErrorResponse } from '../api/errorResponse'

export default class ChecklistController {
	//get
	static getChecklistById: RequestHandler<
		undefined,
		IGetChecklistByIdResponse | IErrorResponse,
		IGetChecklistByIdRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await ChecklistService.getChecklistById(
				req.body
			)
			if (!result)
				return next(
					UserRequestError.NotFound(
						`CHECKLIST WITH ID ${req.body.id} NOT FOUND`
					)
				)

			res.json({
				...result,
				checklistComposition: result.checklistComposition.map(
					record => ({
						...record,
						price: record.price?.toString() || '0',
					})
				),
				checklistPrices: {
					checklistId:
						result.checklistPrices?.checklistId || result.id,
					BYN: result.checklistPrices?.BYN.toString() || '0',
					USD: result.checklistPrices?.USD.toString() || '0',
					RUB: result.checklistPrices?.RUB.toString() || '0',
				},
			})
		} catch (e) {
			return next(e)
		}
	}

	static getAllChecklists: RequestHandler<
		undefined,
		IGetAllChecklistsResponse | IErrorResponse,
		IGetAllChecklistsRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await ChecklistService.getAllChecklists(
				req.body
			)
			res.json({
				checklistsData: result.map(record => ({
					...record,
					checklistPrices: {
						checklistId:
							record.checklistPrices?.checklistId || record.id,
						BYN: record.checklistPrices?.BYN.toString() || '0',
						USD: record.checklistPrices?.USD.toString() || '0',
						RUB: record.checklistPrices?.RUB.toString() || '0',
					},
					checklistComposition: record.checklistComposition.map(
						item => ({
							...item,
							checklistId: item.checklistId,
							price: item.price?.toString() || '0',
						})
					),
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
			const result = await ChecklistService.createChecklist(
				req.body
			)
			res.status(201).json({
				...result,
				checklistComposition: result.checklistComposition.map(
					record => ({
						...record,
						price: record.price?.toString() || '0',
					})
				),
				checklistPrices: {
					checklistId:
						result.checklistPrices?.checklistId || result.id,
					BYN: result.checklistPrices?.BYN.toString() || '0',
					USD: result.checklistPrices?.USD.toString() || '0',
					RUB: result.checklistPrices?.RUB.toString() || '0',
				},
			})
		} catch (e) {
			next(e)
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
			const result = await ChecklistService.updateChecklist(
				req.body
			)
			res.json({
				...result,
				checklistComposition: result.checklistComposition.map(
					record => ({
						...record,
						price: record.price?.toString() || '0',
					})
				),
				checklistPrices: {
					checklistId:
						result.checklistPrices?.checklistId || result.id,
					BYN: result.checklistPrices?.BYN.toString() || '0',
					USD: result.checklistPrices?.USD.toString() || '0',
					RUB: result.checklistPrices?.RUB.toString() || '0',
				},
			})
		} catch (e) {
			if ((e as PrismaClientKnownRequestError).code === 'P2025')
				return next(
					UserRequestError.NotFound(
						`CHECKLIST WITH ID ${req.body.checklistId} NOT FOUND`
					)
				)
			next(e)
		}
	}

	//delete
	static deleteChecklists: RequestHandler<
		undefined,
		IDeleteChecklistResponse | IErrorResponse,
		IDeleteChecklistRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await ChecklistService.deleteChecklist(
				req.body
			)

			if (result[3].count === 0)
				return next(
					UserRequestError.NotFound('NO CHECKLISTS WERE FOUND')
				)

			res.json(result[3])
		} catch (e) {
			next(e)
		}
	}
}
