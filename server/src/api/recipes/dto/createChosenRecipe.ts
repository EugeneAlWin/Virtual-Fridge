export interface ICreateChosenRecipeRequest {
	userId: number
	recipeId: number
}

export interface ICreateChosenRecipeResponse {
	id: number
	userId: number
	recipeId: number
	createdAt: Date
	isCooked: boolean
}
