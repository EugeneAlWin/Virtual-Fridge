import { Currencies } from '../../enums'

export interface ICreateChecklistRequest {
	creatorId: number
	checklistComposition: {
		productId: number
		quantity: number
		price: string
		currency: keyof typeof Currencies
	}[]
	checklistPrices: {
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
