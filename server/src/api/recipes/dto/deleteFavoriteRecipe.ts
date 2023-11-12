export interface IDeleteFavoriteRecipeRequest {
	userId: number
	recipeId: number[]
}

export interface IDeleteFavoriteRecipeResponse {
	count: number
}
