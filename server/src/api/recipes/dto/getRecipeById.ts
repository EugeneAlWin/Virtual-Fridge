import { RecipeTypes } from '../../enums'

export interface IGetRecipeByIdRequest {
	id: number
}

export interface IGetRecipeByIdResponse {
	id: number
	creatorId: number
	title: string
	type: keyof typeof RecipeTypes
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
