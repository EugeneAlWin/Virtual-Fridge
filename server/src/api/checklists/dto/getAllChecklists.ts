import { Currencies, Units } from '../../enums'

export interface IGetAllChecklistsRequest {
	createdAt?: Date
	skip: number
	take: number
	cursor?: number
}

export interface IGetAllChecklistsResponse {
	id: number
	creatorId: number
	createdAt: Date
	isConfirmed: boolean
	checklistComposition: {
		checklistId: number
		productId: number
		quantity: number
		unit: Units
		price: number
		currency: Currencies
	}[]
	checklistPrices: {
		checklistId: number
		USD: number
		BYN: number
		RUB: number
	}
}
