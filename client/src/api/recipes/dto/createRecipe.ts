import { RecipeTypes } from '../../enums'
import { RecipeCompositionData } from '../common'

export interface ICreateRecipeRequest {
	creatorId: number
	title: string
	type: keyof typeof RecipeTypes
	description?: string
	isVisible?: boolean
	recipeComposition: RecipeCompositionData[]
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
	recipeComposition: RecipeCompositionData[]
}
