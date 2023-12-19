import { ChecklistCompositionData, ChecklistPricesData } from '../common'

export interface IGetChecklistByIdRequest {
	id: number
}

export interface IGetChecklistByIdResponse {
	id: number
	creatorId: number
	createdAt: Date
	isConfirmed: boolean
	checklistComposition: ChecklistCompositionData[]
	checklistPrices: ChecklistPricesData
}
