import { Currencies, Units } from '../../enums'

export interface IUpdateChecklistRequest {
	checklistId: number
	creatorId: number
	isConfirmed?: boolean
	checklistComposition?:
		| {
				id: number
				productId: number
				quantity: number
				units: keyof typeof Units
				price: number
				currency: keyof typeof Currencies
		  }[]
		| null
	checklistPrices?: {
		checklistId: number
		USD: string
		BYN: string
		RUB: string
	} | null
}

export interface IUpdateChecklistResponse {
	id: number
	creatorId: number
	createdAt: Date
	isConfirmed: boolean
	ChecklistComposition: {
		checklistId: number
		productId: number
		quantity: number
		units: keyof typeof Units
		price: number
		currency: keyof typeof Currencies
	}[]
	ChecklistPrices: {
		checklistId: number
		USD: string
		BYN: string
		RUB: string
	}
}
