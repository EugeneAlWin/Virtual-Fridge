export interface IDeleteChosenRecipesRequest {
	userId: number
	recipesId: number[]
}

export interface IDeleteChosenRecipesResponse {
	count: number
}
