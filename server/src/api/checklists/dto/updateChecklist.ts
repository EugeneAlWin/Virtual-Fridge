import { ChecklistCompositionData, ChecklistPricesData } from '../common'

export interface IUpdateChecklistRequest {
	checklistId: number
	creatorId: number
	isConfirmed?: boolean
	checklistComposition?: ChecklistCompositionData[]
	checklistPrices?: ChecklistPricesData
}

export interface IUpdateChecklistResponse {
	id: number
	creatorId: number
	createdAt: Date
	isConfirmed: boolean
	checklistComposition: ChecklistCompositionData[]
	checklistPrices: ChecklistPricesData
}
