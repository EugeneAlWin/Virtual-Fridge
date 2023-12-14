import { Currencies } from '../../enums'

export interface IUpdateStoreRequest {
	id: number
	creatorId: number
	title?: string
	storeComposition: {
		productId: number
		quantity: number
		expires?: Date
		price: number
		currency: keyof typeof Currencies
	}[]
}

export interface IUpdateStoreResponse {
	id: number
	creatorId: number
	title: string | null
	storeComposition: {
		productId: number
		quantity: number
		expires: Date | null
		price: number
		currency: keyof typeof Currencies
	}[]
}
