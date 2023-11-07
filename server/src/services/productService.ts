import prismaClient from '../prismaClient'
import { IGetAllProductsRequest } from '../api/products/dto/getAllProducts'
import { ICreateProductRequest } from '../api/products/dto/createProduct'
import { IUpdateProductRequest } from '../api/products/dto/updateProduct'
import { IDeleteProductRequest } from '../api/products/dto/deleteProduct'
import { IGetProductByIdRequest } from '../api/products/dto/getProductById'
import UserRequestError from '../errors/userRequestError'

export default class ProductService {
	//get
	static getProductById = async ({ id }: IGetProductByIdRequest) =>
		prismaClient.product.findFirstOrThrow({
			where: { id },
		})

	static getAllProducts = async ({
		title,
		cursor,
		...interval
	}: IGetAllProductsRequest) =>
		prismaClient.product.findMany({
			...interval,
			cursor: cursor ? { id: cursor } : undefined,
			where: {
				title: { contains: title, mode: 'insensitive' },
			},
		})

	//create
	static createProduct = async (
		productData: ICreateProductRequest
	) => {
		const result = await prismaClient.product.findUnique({
			where: { title: productData.title },
		})
		if (result)
			throw UserRequestError.BadRequest(
				'PRODUCT TITLE ALREADY TAKEN'
			)
		return prismaClient.product.create({
			data: { ...productData },
		})
	}

	//update
	static updateProduct = async ({
		id,
		...productData
	}: IUpdateProductRequest) =>
		prismaClient.product.update({
			where: { id },
			data: { ...productData },
		})

	//delete
	static deleteProduct = async ({
		creatorId,
		productId,
	}: IDeleteProductRequest) =>
		prismaClient.product.deleteMany({
			where: { id: { in: productId }, creatorId },
		})
}
