import { ChecklistCompositionData, ChecklistPricesData } from '../common'

export interface ICreateChecklistRequest {
	creatorId: number
	checklistComposition: ChecklistCompositionData[]
	checklistPrices: ChecklistPricesData
}

export interface ICreateChecklistResponse {
	id: number
	creatorId: number
	createdAt: Date
	isConfirmed: boolean
	checklistComposition: ChecklistCompositionData[]
	checklistPrices: ChecklistPricesData
}
