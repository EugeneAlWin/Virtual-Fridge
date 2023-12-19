export interface IDeleteFavoriteRecipesRequest {
	userId: number
	favoriteRecipesId: number[]
}

export interface IDeleteFavoriteRecipesResponse {
	count: number
}
