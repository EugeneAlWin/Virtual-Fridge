import { Currencies, Units } from '../../enums'

export interface ICreateChecklistRequest {
	creatorId: number
	ChecklistComposition: {
		productId: number
		quantity: number
		units: keyof typeof Units
		price: string
		currency: keyof typeof Currencies
	}[]
	ChecklistPrices: {
		checklistId: number
		USD: string
		BYN: string
		RUB: string
	}
}

export interface ICreateChecklistResponse {
	id: number
	creatorId: number
	createdAt: Date
	isConfirmed: boolean
	ChecklistComposition: {
		checklistId: number
		productId: number
		quantity: number
		units: keyof typeof Units
		price: string
		currency: keyof typeof Currencies
	}[]
	ChecklistPrices: {
		checklistId: number
		USD: string
		BYN: string
		RUB: string
	}
}
