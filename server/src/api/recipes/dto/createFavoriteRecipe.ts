export interface ICreateFavoriteRecipeRequest {
	userId: number
	recipeId: number
}

export interface ICreateFavoriteRecipeResponse {
	id: number
	userId: number
	recipeId: number
}
