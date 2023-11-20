import { Currencies, Units } from '../../enums'

export interface IUpdateChecklistRequest {
	checklistId: number
	creatorId: number
	isConfirmed?: boolean
	checklistComposition: {
		id: number
		productId: number
		quantity: number
		units: keyof typeof Units
		price: string
		currency: keyof typeof Currencies
	}[]
	checklistPrices: {
		checklistId: number
		USD: string
		BYN: string
		RUB: string
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
		units: keyof typeof Units
		price: string | null
		currency: keyof typeof Currencies
	}[]
	checklistPrices: {
		checklistId: number
		USD: string
		BYN: number | null
		RUB: string
	}
}
