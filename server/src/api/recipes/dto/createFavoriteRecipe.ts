import { RecipeTypes } from '../../enums'

export interface ICreateFavoriteRecipeRequest {
	userId: number
	recipeId: number
}

export interface ICreateFavoriteRecipeResponse {
	id: number
	creatorId: number
	title: string
	type: keyof typeof RecipeTypes
	description: string
	createdAt: Date
	isApproved: boolean
	recipeComposition: {
		productId: number
		recipeId: number
		quantity: number
	}[]
}
