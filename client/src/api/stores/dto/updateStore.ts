import { Currencies, Units } from '../../enums'

export interface IUpdateStoreRequest {
	id: number
	creatorId: number
	title?: string
	storeComposition: StoreCompositionData[]
}

export interface StoreCompositionData {
	productId: number
	quantity: number
	unit: keyof typeof Units
	expires?: Date
	price: string
	currency: keyof typeof Currencies
}

export interface IUpdateStoreResponse {
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
