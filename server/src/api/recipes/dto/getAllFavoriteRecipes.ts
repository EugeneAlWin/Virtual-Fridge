import { RecipeTypes } from '../../enums'

export interface IGetAllFavoriteRecipesRequest {
	skip: number
	take: number
	userId: number
	title?: string
	cursor?: number
}

export interface IGetAllFavoriteRecipesResponse {
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
