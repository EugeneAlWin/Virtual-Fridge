import { ProductData } from '../common'

export interface IGetAllProductsRequest {
	title?: string
	skip: number
	take: number
	cursor?: number
}

export interface IGetAllProductsResponse {
	productsData: ProductData[]
	cursor: number | null
}
