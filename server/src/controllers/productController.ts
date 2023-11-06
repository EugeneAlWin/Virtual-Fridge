import { NextFunction, RequestHandler } from 'express'
import { IErrorResponse } from '../api/errorResponse'
import {
	FieldValidationError,
	ValidationError,
	validationResult,
} from 'express-validator'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import UserRequestError from '../errors/userRequestError'
import {
	IGetProductByIdRequest,
	IGetProductByIdResponse,
} from '../api/products/dto/getProductById'
import ProductService from '../services/productService'
import {
	IGetAllProductsRequest,
	IGetAllProductsResponse,
} from '../api/products/dto/getAllProducts'
import {
	ICreateProductRequest,
	ICreateProductResponse,
} from '../api/products/dto/createProduct'
import {
	IUpdateProductRequest,
	IUpdateProductResponse,
} from '../api/products/dto/updateProduct'
import { IDeleteUserTokensResponse } from '../api/users/dto/deleteUserTokens'
import {
	IDeleteProductRequest,
	IDeleteProductResponse,
} from '../api/products/dto/deleteProduct'

export default class ProductController {
	//get
	static getProductById: RequestHandler<
		IGetProductByIdRequest,
		IGetProductByIdResponse | IErrorResponse
	> = async (req, res, next) => {
		const validatedData = validationResult(req)
		if (!validatedData.isEmpty()) {
			const error = validatedData.array()[0]
			return ProductController.callUnprocessableEntity(next, error)
		}
		try {
			const result = await ProductService.getProductById(
				req.params
			)
			res.json(result as IGetProductByIdResponse)
		} catch (e) {
			if ((e as PrismaClientKnownRequestError)?.code === 'P2025') {
				return next(
					UserRequestError.NotFound('PRODUCT NOT FOUND')
				)
			}
			return next(e)
		}
	}

	static getAllProducts: RequestHandler<
		undefined,
		IGetAllProductsResponse[] | IErrorResponse,
		IGetAllProductsRequest
	> = async (req, res, next) => {
		const validatedData = validationResult(req)
		if (!validatedData.isEmpty()) {
			const error = validatedData.array()[0]
			return ProductController.callUnprocessableEntity(next, error)
		}
		try {
			const result = await ProductService.getAllProducts(req.body)
			res.json(result as IGetAllProductsResponse[])
		} catch (e) {
			return next(e)
		}
	}

	//create
	static createProduct: RequestHandler<
		undefined,
		ICreateProductResponse | IErrorResponse,
		ICreateProductRequest
	> = async (req, res, next) => {
		const validatedData = validationResult(req)
		if (!validatedData.isEmpty()) {
			const error = validatedData.array()[0]
			return ProductController.callUnprocessableEntity(next, error)
		}
		try {
			const result = await ProductService.createProduct(req.body)
			res.status(201).json(result as ICreateProductResponse)
		} catch (e) {
			if ((e as PrismaClientKnownRequestError).code === 'P2002')
				return next(UserRequestError.BadRequest('PRODUCT EXISTS'))
			next(e)
		}
	}

	//update
	static updateProductData: RequestHandler<
		undefined,
		IUpdateProductResponse | IErrorResponse,
		IUpdateProductRequest
	> = async (req, res, next) => {
		const validatedData = validationResult(req)
		if (!validatedData.isEmpty()) {
			const error = validatedData.array()[0]
			return ProductController.callUnprocessableEntity(next, error)
		}
		try {
			const result = await ProductService.updateProduct(req.body)
			res.json(result as IUpdateProductResponse)
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
	static deleteProducts: RequestHandler<
		undefined,
		IDeleteProductResponse | IErrorResponse,
		IDeleteProductRequest
	> = async (req, res, next) => {
		const validatedData = validationResult(req)
		if (!validatedData.isEmpty()) {
			const error = validatedData.array()[0]
			return ProductController.callUnprocessableEntity(next, error)
		}
		try {
			const result = await ProductService.deleteProduct(req.body)

			if (result.count === 0)
				return next(
					UserRequestError.NotFound('NO PRODUCTS WERE FOUND')
				)

			res.json(result as IDeleteUserTokensResponse)
		} catch (e) {
			next(e)
		}
	}

	//Helper, passes UnprocessableEntity error to middleware
	private static callUnprocessableEntity(
		next: NextFunction,
		error: ValidationError
	) {
		next(
			UserRequestError.UnprocessableEntity({
				message: error.msg,
				location: (error as FieldValidationError).location,
				field: (error as FieldValidationError).path,
			})
		)
	}
}
