export interface IUpdateChosenRecipeRequest {
	userId: number
	chosenRecipeId: number
	isCooked?: boolean
}

export interface IUpdateChosenRecipeResponse {
	id: number
	userId: number
	recipeId: number
	createdAt: Date
	isCooked: boolean
}
