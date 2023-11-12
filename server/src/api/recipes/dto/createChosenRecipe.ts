export interface ICreateChosenRecipeRequest {
	userId: number
	recipeId: number
	isCooked: boolean
}

export interface ICreateChosenRecipeResponse {
	userId: number
	recipeId: number
	createdAt: Date
	isCooked: boolean
}
