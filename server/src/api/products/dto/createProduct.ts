export interface ICreateProductRequest {
	title: string
	calories: number
	protein: number
	fats: number
	carbohydrates: number
	creatorId: number
}

export interface ICreateProductResponse {
	id: number
	title: string
	calories: number
	protein: number
	fats: number
	carbohydrates: number
	creatorId: number | null
}
