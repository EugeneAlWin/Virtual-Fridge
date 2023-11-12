import { RecipeTypes } from '../../enums'

export interface IUpdateRecipeRequest {
	id: number
	creatorId: number
	title?: string
	type?: RecipeTypes
	description?: string
	isVisible?: boolean
	recipeComposition?: {
		productId: number
		recipeId: number
		quantity: number
	}[]
}

export interface IUpdateRecipeResponse {
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