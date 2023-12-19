import { RecipeTypes } from '../../enums'
import { RecipeCompositionData } from '../common'

export interface IGetRecipeByIdRequest {
	id: number
}

export interface IGetRecipeByIdResponse {
	id: number
	creatorId: number | null
	title: string
	type: keyof typeof RecipeTypes
	description: string | null
	createdAt: Date
	isVisible: boolean
	isApproved: boolean
	recipeComposition: RecipeCompositionData[]
}
