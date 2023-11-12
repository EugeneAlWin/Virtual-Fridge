import { RecipeTypes } from '../../enums'

export interface IGetAllRecipesRequest {
	title?: string
	skip: number
	take: number
	cursor?: number
	isVisible?: boolean
}

export interface IGetAllRecipesResponse {
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
