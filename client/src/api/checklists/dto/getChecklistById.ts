import { Currencies } from '../../enums'
import { ProductData } from '../../products/common'

export interface IGetChecklistByIdRequest {
	id: number
}

export interface IGetChecklistByIdResponse {
	id: number
	creatorId: number
	createdAt: Date
	isConfirmed: boolean
	checklistComposition: {
		product: ProductData | undefined
		quantity: number
		price: number
		currency: keyof typeof Currencies
	}[]
	checklistPrices: {
		USD: number | null
		BYN: number | null
		RUB: number | null
	}
}
