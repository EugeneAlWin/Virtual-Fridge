import { RecipeTypes } from '../../enums'

export interface IGetAllFavoriteRecipesRequest {
	skip: number
	take: number
	userId: number
	title?: string
	cursor?: number
}

export interface IGetAllFavoriteRecipesResponse {
	cursor: number | null
	favoriteRecipesData: {
		info: {
			favoriteRecipeId: number
			userId: number
			recipeId: number
		}
		recipeDataPreview: {
			id: number
			creatorId: number
			title: string
			type: keyof typeof RecipeTypes
			description: string | null
			createdAt: Date
			isVisible: boolean
			isApproved: boolean
		}
	}[]
}
