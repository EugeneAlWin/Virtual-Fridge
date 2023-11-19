import { RequestHandler } from 'express'
import { IErrorResponse } from '../api/errorResponse'
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
import {
	IDeleteProductRequest,
	IDeleteProductResponse,
} from '../api/products/dto/deleteProduct'
import callUnprocessableEntity from '../helpers/callUnprocessableEntity'
import getValidationResult from '../helpers/getValidationResult'

export default class ProductController {
	//get
	static getProductById: RequestHandler<
		undefined,
		IGetProductByIdResponse | IErrorResponse,
		IGetProductByIdRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await ProductService.getProductById(req.body)
			if (!result)
				return next(
					UserRequestError.NotFound(
						`PRODUCT WITH ID ${req.body.id} NOT FOUND`
					)
				)

			res.json(result)
		} catch (e) {
			return next(e)
		}
	}

	static getAllProducts: RequestHandler<
		undefined,
		IGetAllProductsResponse | IErrorResponse,
		IGetAllProductsRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await ProductService.getAllProducts(req.body)
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
		IDeleteProductResponse | IErrorResponse,
		IDeleteProductRequest
	> = async (req, res, next) => {
		const errorData = getValidationResult(req)
		if (errorData) return callUnprocessableEntity(next, errorData)

		try {
			const result = await ProductService.deleteProduct(req.body)

			if (result.count === 0)
				return next(
					UserRequestError.NotFound('NO PRODUCTS WERE FOUND')
				)

			res.json(result)
		} catch (e) {
			return next(e)
		}
	}
}
