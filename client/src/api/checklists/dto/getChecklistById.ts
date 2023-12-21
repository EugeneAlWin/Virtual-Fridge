import { ChecklistCompositionData, ChecklistPricesData } from '../common'
import { ProductData } from '../../products/common.ts'

export interface IGetChecklistByIdRequest {
	id: number
}

export interface IGetChecklistByIdResponse {
	id: number
	creatorId: number
	createdAt: Date
	isConfirmed: boolean
	checklistComposition: (ChecklistCompositionData & {
		product: ProductData | undefined
	})[]
	checklistPrices: ChecklistPricesData
}
