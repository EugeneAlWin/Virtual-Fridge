import { RecipeTypes } from '../../enums'

export interface ICreateRecipeRequest {
	creatorId: number
	title: string
	type: RecipeTypes
	description?: string
	isVisible?: boolean
	recipeComposition: {
		productId: number
		quantity: number
	}[]
}

export interface ICreateRecipeResponse {
	id: number
	creatorId: number
	title: string
	type: RecipeTypes
	description: string
	createdAt: Date
	isVisible: boolean
	isApproved: boolean
	recipeComposition: {
		productId: number
		recipeId: number
		quantity: number
	}[]
}
