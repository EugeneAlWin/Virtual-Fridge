import { RecipeTypes } from '../../enums'

export interface IGetAllRecipesRequest {
	title?: string
	skip: number
	take: number
	cursor?: number
	isVisible?: boolean
	isApproved?: boolean
}

export interface IGetAllRecipesResponse {
	cursor: number | null
	recipesData: {
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
	}[]
}
