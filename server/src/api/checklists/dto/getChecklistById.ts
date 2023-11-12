import { Units } from '../../enums'

export interface IGetChecklistByIdRequest {
	id: number
	creatorId: number
}

export interface IGetChecklistByIdResponse {
	id: number
	creatorId: number
	createdAt: Date
	isConfirmed: boolean
	ChecklistComposition: {
		checklistId: number
		productId: number
		quantity: number
		units: keyof typeof Units
	}[]
	ChecklistPrices: {
		checklistId: number
		USD: string
		BYN: string
		RUB: string
	}
}
