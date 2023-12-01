import { RecipeTypes, Units } from '../../enums'

export interface IGetAllRecipesRequest {
	title?: string
	skip: number
	take: number
	cursor?: {
		productId: number
		recipeId: number
	}
	recipeId: number
	productId: number
	isVisible?: boolean
	isApproved?: boolean
}

export interface IGetAllRecipesResponse {
	cursor: {
		productId: number
		recipeId: number
	} | null
	recipesData: {
		recipe: {
			id: number
			creatorId: number | null
			title: string
			type: keyof typeof RecipeTypes
			description: string | null
			createdAt: Date
			isVisible: boolean
			isApproved: boolean
			products: RecipesProductData[]
		}
	}[]
}

export interface RecipesProductData {
	id: number
	title: string
	calories: number
	protein: number
	fats: number
	carbohydrates: number
	creatorId: number | null
	quantity: number
	units: keyof typeof Units
}
