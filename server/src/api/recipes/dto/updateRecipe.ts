import { RecipeTypes } from '../../enums'

export interface IUpdateRecipeRequest {
	id: number
	creatorId: number
	title?: string
	type?: keyof typeof RecipeTypes
	description?: string
	isVisible?: boolean
	isApproved?: boolean
	recipeComposition?: {
		productId: number
		recipeId: number
		quantity: number
	}[]
}

export interface IUpdateRecipeResponse {
	id: number
	creatorId: number | null
	title: string
	type: keyof typeof RecipeTypes
	description: string | null
	createdAt: Date
	isVisible: boolean
	isApproved: boolean
	recipeComposition: {
		productId: number
		recipeId: number
		quantity: number
	}[]
}
