import { ProductData } from '../common'

export interface IUpdateProductRequest extends Partial<ProductData> {
	id: number | undefined
}

export interface IUpdateProductResponse extends ProductData {}
