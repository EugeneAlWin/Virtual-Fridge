import { ProductData } from '../common'

export interface IUpdateProductRequest extends Partial<ProductData> {
	id: number
}

export interface IUpdateProductResponse extends ProductData {}
