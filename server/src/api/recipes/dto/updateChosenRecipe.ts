export interface IUpdateChosenRecipeRequest {
	userId: number
	recipeId: number
	isCooked: boolean
}

export interface IUpdateChosenRecipeResponse {
	userId: number
	recipeId: number
	createdAt: Date
	isCooked: boolean
}
