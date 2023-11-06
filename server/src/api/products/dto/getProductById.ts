export interface IGetProductByIdRequest {
	id: number
}

export interface IGetProductByIdResponse {
	id: number
	title: string
	calories: number
	protein: number
	fats: number
	carbohydrates: number
	creatorId: number
}
