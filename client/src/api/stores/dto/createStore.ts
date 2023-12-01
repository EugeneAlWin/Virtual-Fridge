import { Currencies, Units } from '../../enums'

export interface ICreateStoreRequest {
	creatorId: number
	title?: string
	storeComposition: {
		productId: number
		quantity: number
		unit: keyof typeof Units
		expires?: Date
		price: string
		currency: keyof typeof Currencies
	}[]
}

export interface ICreateStoreResponse {
	id: number
	creatorId: number
	title: string | null
	storeComposition: {
		storeId: number
		productId: number
		quantity: number
		unit: keyof typeof Units
		expires: Date | null
		price: number
		currency: keyof typeof Currencies
	}[]
}
