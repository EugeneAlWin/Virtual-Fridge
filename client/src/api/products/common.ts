import { Units } from '../enums'

export interface ProductData {
	id: number
	title: string
	calories: number
	protein: number
	fats: number
	carbohydrates: number
	creatorId: number | null
	units: keyof typeof Units
}
