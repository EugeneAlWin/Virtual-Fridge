import { Currencies, Units } from '../../enums'

export interface IGetChecklistByIdRequest {
	id: number
	creatorId: number
}

export interface IGetChecklistByIdResponse {
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
