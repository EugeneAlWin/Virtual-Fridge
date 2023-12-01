import { Currencies, Units } from '../../enums'

export interface IGetStoreByUserIdRequest {
	creatorId: number
}

export interface IGetStoreByUserIdResponse {
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
