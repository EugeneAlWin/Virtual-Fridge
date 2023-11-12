import { RecipeTypes } from '../../enums'

export interface IGetAllChosenRecipesRequest {
	skip: number
	take: number
	userId: number
	title?: string
	cursor?: number
}

export interface IGetAllChosenRecipesResponse {
	chosenRecipesData: {
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
	}[]
	cursor: number | null
}
