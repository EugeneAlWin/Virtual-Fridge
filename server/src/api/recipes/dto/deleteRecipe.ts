export interface IDeleteRecipesRequest {
	userId: number
	recipesId: number[]
}

export interface IDeleteRecipesResponse {
	count: number
}
