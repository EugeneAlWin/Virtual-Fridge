export interface IDeleteChosenRecipeRequest {
	userId: number
	recipeId: number[]
}

export interface IDeleteChosenRecipeResponse {
	count: number
}
