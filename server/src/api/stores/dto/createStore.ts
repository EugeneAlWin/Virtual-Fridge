import { Currencies, Units } from '../../enums'

export interface ICreateStoreRequest {
	title?: string
}

export interface ICreateStoreResponse {
	id: number
	creatorId: number
	title: string
	storeComposition: {
		storeId: number
		productId: number
		quantity: number
		unit: Units
		expires: Date | null
		price: number
		currency: Currencies
	}[]
}
