import { Currencies, Units } from '../../enums'

export interface IGetAllChecklistsRequest {
	skip: number
	take: number
	creatorId: number
	createdAt?: Date
	cursor?: number
}

export interface IGetAllChecklistsResponse {
	checklistsData: {
		id: number
		creatorId: number
		createdAt: Date
		isConfirmed: boolean
		checklistComposition: {
			checklistId: number
			productId: number
			quantity: number
			units: keyof typeof Units
			price: number
			currency: keyof typeof Currencies
		}[]
		checklistPrices: {
			checklistId: number
			USD: number | null
			BYN: number | null
			RUB: number | null
		}
	}[]
	cursor: number | null
}
