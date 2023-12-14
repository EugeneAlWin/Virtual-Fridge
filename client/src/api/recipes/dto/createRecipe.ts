import { RecipeTypes } from '../../enums'

export interface ICreateRecipeRequest {
	creatorId: number
	title: string
	type: keyof typeof RecipeTypes
	description?: string
	isVisible?: boolean
	recipeComposition: {
		productId: number
		quantity: number
	}[]
}

export interface ICreateRecipeResponse {
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
