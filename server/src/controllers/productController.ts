import { RequestHandler } from 'express'
import { IErrorResponse } from '../api/errorResponse'
import {
	ICreateProductRequest,
	ICreateProductResponse,
} from '../api/products/dto/createProduct'
import {
	IDeleteProductsRequest,
	IDeleteProductsResponse,
} from '../api/products/dto/deleteProduct'
import {
	IGetAllProductsRequest,
	IGetAllProductsResponse,
} from '../api/products/dto/getAllProducts'
import {
	IGetProductByIdRequest,
	IGetProductByIdResponse,
} from '../api/products/dto/getProductById'
import {
	IGetProductsByIdRequest,
	IGetProductsByIdResponse,
} from '../api/products/dto/getProductsById'
import {
	IUpdateProductRequest,
	IUpdateProductResponse,
} from '../api/products/dto/updateProduct'
import UserRequestError from '../errors/userRequestError'
import callUnprocessableEntity from '../helpers/callUnprocessableEntity'
import getValidationResult from '../helpers/getValidationResult'
import ProductService from '../services/productService'

export default class ProductController {
	//get
	static getProductById: RequestHandler<
		undefined,
		IGetProductByIdResponse | IErrorResponse,
		undefined,
		IGetProductByIdRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await ProductService.getProductById(req.query)
			if (!result)
				return next(
					UserRequestError.NotFound(
						`PRODUCT WITH ID ${req.query.id} NOT FOUND`
					)
				)

			res.json(result)
		} catch (e) {
			return next(e)
		}
	}

	static getProductsById: RequestHandler<
		undefined,
		IGetProductsByIdResponse[] | IErrorResponse,
		undefined,
		IGetProductsByIdRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await ProductService.getProductsById(req.query)
			if (!result) return next(UserRequestError.NotFound(''))

			res.json(result)
		} catch (e) {
			return next(e)
		}
	}

	static getAllProducts: RequestHandler<
		undefined,
		IGetAllProductsResponse | IErrorResponse,
		undefined,
		IGetAllProductsRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await ProductService.getAllProducts(req.query)
			res.json({
				productsData: result,
				cursor: result[result.length - 1]?.id || null,
			})
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
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await ProductService.createProduct(req.body)
			res.status(201).json(result)
		} catch (e) {
			return next(e)
		}
	}

	//update
	static updateProductData: RequestHandler<
		undefined,
		IUpdateProductResponse | IErrorResponse,
		IUpdateProductRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await ProductService.updateProduct(req.body)
			res.json(result)
		} catch (e) {
			return next(e)
		}
	}

	//delete
	static deleteProducts: RequestHandler<
		undefined,
		IDeleteProductsResponse | IErrorResponse,
		IDeleteProductsRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await ProductService.deleteProduct(req.body)

			res.json(result)
		} catch (e) {
			return next(e)
		}
	}
}
