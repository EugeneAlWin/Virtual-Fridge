import $api from '../axios/base.ts'
import {
	IUpdateRecipeRequest,
	IUpdateRecipeResponse,
} from '../../api/recipes/dto/updateRecipe.ts'
import axios, { AxiosResponse } from 'axios'
import RecipeEndpoints from '../../api/recipes/endpoints.ts'
import queryClient from '../queryClient.ts'
import { useMutation } from '@tanstack/react-query'
import { IErrorResponse } from '../../api/errorResponse.ts'
import { Units } from '../../api/enums.ts'

export function useUpdateRecipe() {
	return useMutation<
		IUpdateRecipeResponse | void,
		IErrorResponse,
		{
			selectedRecipe: IUpdateRecipeResponse
			productsModal: {
				productId: number
				title: string
				quantity: number
				units: Units
			}[]
		}
	>({
		mutationFn: async ({ selectedRecipe, productsModal }) => {
			try {
				if (!selectedRecipe) return
				const result = await $api.patch<
					IUpdateRecipeResponse,
					AxiosResponse<IUpdateRecipeResponse>,
					IUpdateRecipeRequest
				>(`${RecipeEndpoints.BASE}${RecipeEndpoints.UPDATE}`, {
					description: selectedRecipe.description ?? undefined,
					title: selectedRecipe.title,
					id: selectedRecipe.id,
					type: selectedRecipe.type,
					isVisible: selectedRecipe.isVisible,
					isApproved: selectedRecipe.isApproved,
					recipeComposition: productsModal.map(item => ({
						productId: item.productId,
						quantity: item.quantity,
					})),
				})
				return result.data
			} catch (e) {
				if (axios.isAxiosError(e)) throw e?.response?.data
				throw e
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['recipes'],
			})
		},
	})
}
