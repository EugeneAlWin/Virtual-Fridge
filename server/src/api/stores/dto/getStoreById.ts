import { Currencies, Units } from '../../enums'

export interface IGetStoreByIdRequest {
	id: number
}

export interface IGetStoreByIdResponse {
	id: number
	creatorId: number
	title: string
	storeComposition: {
		storeId: number
		productId: number
		quantity: number
		unit: Units
		expires: Date
		price: number
		currency: Currencies
	}[]
}
