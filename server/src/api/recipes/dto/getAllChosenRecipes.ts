import { RecipeTypes } from '../../enums'

export interface IGetAllChosenRecipesRequest {
	skip: number
	take: number
	userId: number
	title?: string
	cursor?: number
}

export interface IGetAllChosenRecipesResponse {
	cursor: number | null
	chosenRecipesData: {
		info: {
			chosenRecipeId: number
			userId: number
			recipeId: number
			createdAt: Date
			isCooked: boolean
		}
		recipeDataPreview: {
			id: number
			creatorId: number | null
			title: string
			type: keyof typeof RecipeTypes
			description: string | null
			createdAt: Date
			isApproved: boolean
		}
	}[]
}
