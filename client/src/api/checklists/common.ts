import { Currencies } from 'api/enums'

export type ChecklistCompositionData = {
	productId: number
	quantity: number
	price: number
	currency: keyof typeof Currencies
}

export type ChecklistPricesData = {
	USD: number | null
	BYN: number | null
	RUB: number | null
}
