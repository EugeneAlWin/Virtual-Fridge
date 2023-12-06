import { ProductData } from '../common'

export interface IUpdateProductRequest {
	id: number
	title?: string
	calories?: number
	protein?: number
	fats?: number
	carbohydrates?: number
}

export interface IUpdateProductResponse extends ProductData {}
