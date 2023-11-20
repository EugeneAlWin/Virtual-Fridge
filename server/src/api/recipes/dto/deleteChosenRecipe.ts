export interface IDeleteChosenRecipesRequest {
	userId: number
	chosenRecipesId: number[]
}

export interface IDeleteChosenRecipesResponse {
	count: number
}
