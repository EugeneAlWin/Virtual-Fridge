import { ChecklistPricesData } from '../common'

export interface IGetAllChecklistsPreviewRequest {
	skip: number
	take: number
	creatorId: number
	createdAt?: Date
	cursor?: number
}

export interface IGetAllChecklistsPreviewResponse {
	checklistsData: {
		id: number
		creatorId: number
		createdAt: Date
		isConfirmed: boolean
		checklistPrices: ChecklistPricesData
	}[]
	cursor: number | null
}
