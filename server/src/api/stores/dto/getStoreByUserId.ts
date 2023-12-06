import { Currencies, Units } from '../../enums'
import { ProductData } from '../../products/common'

export interface IGetStoreByUserIdRequest {
	creatorId: number
}

export interface IGetStoreByUserIdResponse {
	id: number
	creatorId: number
	title: string | null
	storeComposition: {
		product: ProductData | undefined
		quantity: number
		unit: keyof typeof Units
		expires: Date | null
		price: number
		currency: keyof typeof Currencies
	}[]
}
