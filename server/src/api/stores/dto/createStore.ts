import { Currencies, Units } from '../../enums'

export interface ICreateStoreRequest {
	creatorId: number
	title?: string
	StoreComposition: {
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
	StoreComposition: {
		storeId: number
		productId: number
		quantity: number
		unit: keyof typeof Units
		expires: Date | null
		price: string
		currency: keyof typeof Currencies
	}[]
}
