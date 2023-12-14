import { ProductData } from '../common'

export interface IGetProductsByIdRequest {
	ids: number[]
}

export interface IGetProductsByIdResponse extends ProductData {}
