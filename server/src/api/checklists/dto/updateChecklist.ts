import { Currencies, Units } from '../../enums'

export interface IUpdateChecklistRequest {
	checklistId: number
	creatorId: number
	checklistComposition?: {
		productId: number
		quantity?: number
		unit?: Units
		price?: number
		currency?: Currencies
	}[]
	checklistPrices?: {
		checklistId: number
		USD?: number
		BYN?: number
		RUB?: number
	}
}

export interface IUpdateChecklistResponse {
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
