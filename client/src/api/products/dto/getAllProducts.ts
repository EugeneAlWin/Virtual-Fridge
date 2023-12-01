export interface IGetAllProductsRequest {
	title?: string
	skip: number
	take: number
	cursor?: number
}

export interface IGetAllProductsResponse {
	productsData: {
		id: number
		title: string
		calories: number
		protein: number
		fats: number
		carbohydrates: number
		creatorId: number | null
	}[]
	cursor: number | null
}
