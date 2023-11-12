import { Currencies, Units } from '../../enums'

export interface IUpdateStoreRequest {
	id: number
	creatorId: number
	title?: string
	storeComposition?: {
		storeId: number
		productId: number
		quantity: number
		unit: keyof typeof Units
		expires?: Date
		price: number
		currency: keyof typeof Currencies
	}[]
}

export interface IUpdateStoreResponse {
	id: number
	creatorId: number
	title: string
	storeComposition: {
		storeId: number
		productId: number
		quantity: number
		unit: keyof typeof Units
		expires: Date
		price: number
		currency: keyof typeof Currencies
	}[]
}
