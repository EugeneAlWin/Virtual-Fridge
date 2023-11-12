import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import {
	ICreateChecklistRequest,
	ICreateChecklistResponse,
} from 'api/checklists/dto/createChecklist'
import {
	IDeleteChecklistRequest,
	IDeleteChecklistResponse,
} from 'api/checklists/dto/deleteChecklist'
import {
	IGetAllChecklistsRequest,
	IGetAllChecklistsResponse,
} from 'api/checklists/dto/getAllChecklists'
import {
	IGetChecklistByIdRequest,
	IGetChecklistByIdResponse,
} from 'api/checklists/dto/getChecklistById'
import {
	IUpdateChecklistRequest,
	IUpdateChecklistResponse,
} from 'api/checklists/dto/updateChecklist'
import { RequestHandler } from 'express'
import { IErrorResponse } from '../api/errorResponse'
import UserRequestError from '../errors/userRequestError'
import callUnprocessableEntity from '../helpers/callUnprocessableEntity'
import getValidationResult from '../helpers/getValidationResult'
import ChecklistService from '../services/checklistService'

export default class ChecklistController {
	//get
	static getChecklistById: RequestHandler<
		IGetChecklistByIdRequest,
		IGetChecklistByIdResponse | IErrorResponse
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await ChecklistService.getChecklistById(
				req.body
			)
			res.json({
				...result,
				ChecklistComposition: result.ChecklistComposition.map(
					record => ({
						...record,
						price: record.price?.toString() || '0',
					})
				),
				ChecklistPrices: {
					checklistId:
						result.ChecklistPrices?.checklistId || result.id,
					BYN: result.ChecklistPrices?.BYN.toString() || '0',
					USD: result.ChecklistPrices?.USD.toString() || '0',
					RUB: result.ChecklistPrices?.RUB.toString() || '0',
				},
			})
		} catch (e) {
			if ((e as PrismaClientKnownRequestError)?.code === 'P2025') {
				return next(
					UserRequestError.NotFound('CHECKLIST NOT FOUND')
				)
			}
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
					ChecklistPrices: {
						checklistId:
							record.ChecklistPrices?.checklistId || record.id,
						BYN: record.ChecklistPrices?.BYN.toString() || '0',
						USD: record.ChecklistPrices?.USD.toString() || '0',
						RUB: record.ChecklistPrices?.RUB.toString() || '0',
					},
					ChecklistComposition: record.ChecklistComposition.map(
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
				ChecklistComposition: result.ChecklistComposition.map(
					record => ({
						...record,
						price: record.price?.toString() || '0',
					})
				),
				ChecklistPrices: {
					checklistId:
						result.ChecklistPrices?.checklistId || result.id,
					BYN: result.ChecklistPrices?.BYN.toString() || '0',
					USD: result.ChecklistPrices?.USD.toString() || '0',
					RUB: result.ChecklistPrices?.RUB.toString() || '0',
				},
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
				ChecklistComposition: result.ChecklistComposition.map(
					record => ({
						...record,
						price: record.price?.toString() || '0',
					})
				),
				ChecklistPrices: {
					checklistId:
						result.ChecklistPrices?.checklistId || result.id,
					BYN: result.ChecklistPrices?.BYN.toString() || '0',
					USD: result.ChecklistPrices?.USD.toString() || '0',
					RUB: result.ChecklistPrices?.RUB.toString() || '0',
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
