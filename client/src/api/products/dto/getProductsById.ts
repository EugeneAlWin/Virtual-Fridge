export interface IGetProductsByIdRequest {
	ids: number[]
}

export interface IGetProductsByIdResponse {
	id: number
	title: string
	calories: number
	protein: number
	fats: number
	carbohydrates: number
	creatorId: number | null
}
