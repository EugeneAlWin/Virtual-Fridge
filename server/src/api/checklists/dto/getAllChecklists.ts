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
			price: string
			currency: keyof typeof Currencies
		}[]
		checklistPrices: {
			checklistId: number
			USD: string
			BYN: string
			RUB: string
		}
	}[]
	cursor: number | null
}
