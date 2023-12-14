import { ICreateProductRequest } from '../api/products/dto/createProduct'
import { IDeleteProductsRequest } from '../api/products/dto/deleteProduct'
import { IGetAllProductsRequest } from '../api/products/dto/getAllProducts'
import { IGetProductByIdRequest } from '../api/products/dto/getProductById'
import { IGetProductsByIdRequest } from '../api/products/dto/getProductsById'
import { IUpdateProductRequest } from '../api/products/dto/updateProduct'
import UserRequestError from '../errors/userRequestError'
import prismaClient from '../prismaClient'

export default class ProductService {
	//get
	static getProductById = async ({ id }: IGetProductByIdRequest) =>
		prismaClient.product.findUnique({
			where: { id },
		})

	static getProductsById = async ({ ids }: IGetProductsByIdRequest) =>
		prismaClient.product.findMany({
			where: { id: { in: ids } },
		})

	static getAllProducts = async ({
		title,
		cursor,
		skip,
		take,
	}: IGetAllProductsRequest) =>
		prismaClient.product.findMany({
			skip,
			take,
			cursor: cursor ? { id: cursor } : undefined,
			where: {
				title: title ? { contains: title, mode: 'insensitive' } : undefined,
			},
		})

	//create
	static createProduct = async ({
		calories,
		carbohydrates,
		fats,
		protein,
		title,
		creatorId,
		units,
	}: ICreateProductRequest) => {
		const user = await prismaClient.user.findUnique({
			where: { id: creatorId || undefined },
			select: { id: true },
		})
		if (!user)
			throw UserRequestError.NotFound(`USER WITH ID ${creatorId} NOT FOUND`)

		const productTitle = await prismaClient.product.findUnique({
			where: { title },
			select: { title: true },
		})
		if (productTitle)
			throw UserRequestError.BadRequest('PRODUCT TITLE ALREADY TAKEN')

		return prismaClient.product.create({
			data: {
				calories,
				carbohydrates,
				fats,
				protein,
				title,
				creatorId,
				units,
			},
		})
	}

	//update
	static updateProduct = async ({
		id,
		calories,
		carbohydrates,
		fats,
		protein,
		title,
	}: IUpdateProductRequest) => {
		const product = await prismaClient.product.findUnique({
			where: { id },
			select: { id: true },
		})
		if (!product)
			throw UserRequestError.NotFound(`PRODUCT WITH ID ${id} NOT FOUND`)

		return prismaClient.product.update({
			where: { id },
			data: { calories, carbohydrates, fats, protein, title },
		})
	}

	//delete
	static deleteProduct = async ({ productsId }: IDeleteProductsRequest) =>
		prismaClient.product.deleteMany({
			where: { id: { in: productsId } },
		})
}
