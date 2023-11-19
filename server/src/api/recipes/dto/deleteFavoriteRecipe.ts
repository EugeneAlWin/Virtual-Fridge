export interface IDeleteFavoriteRecipesRequest {
	userId: number
	recipesId: number[]
}

export interface IDeleteFavoriteRecipesResponse {
	count: number
}
