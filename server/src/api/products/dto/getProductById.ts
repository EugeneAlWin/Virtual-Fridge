import { ProductData } from '../common'

export interface IGetProductByIdRequest {
	id: number
}

export interface IGetProductByIdResponse extends ProductData {}
