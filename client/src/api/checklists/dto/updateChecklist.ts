import { Currencies } from '../../enums'

export interface IUpdateChecklistRequest {
	checklistId: number
	creatorId: number
	isConfirmed?: boolean
	checklistComposition?: {
		id: number
		productId: number
		quantity: number
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
		price: number
		currency: keyof typeof Currencies
	}[]
	checklistPrices: {
		checklistId: number
		USD: number | null
		BYN: number | null
		RUB: number | null
	}
}
