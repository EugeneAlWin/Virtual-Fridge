import $api from '../axios/base.ts'
import {
	ICreateRecipeRequest,
	ICreateRecipeResponse,
} from '../../api/recipes/dto/createRecipe.ts'
import axios, { AxiosResponse } from 'axios'
import RecipeEndpoints from '../../api/recipes/endpoints.ts'
import queryClient from '../queryClient.ts'
import { useMutation } from '@tanstack/react-query'
import { IErrorResponse } from '../../api/errorResponse.ts'
import { Units } from '../../api/enums.ts'
import useVirtualStore from '../../storage'

export function useCreateRecipe() {
	const { userId } = useVirtualStore()

	return useMutation<
		ICreateRecipeResponse | void,
		IErrorResponse,
		{
			newRecipe: ICreateRecipeRequest
			productsModal: {
				productId: number
				title: string
				quantity: number
				units: Units
			}[]
		}
	>({
		mutationFn: async ({ newRecipe, productsModal }) => {
			try {
				if (userId) {
					const result = await $api.post<
						ICreateRecipeResponse,
						AxiosResponse<ICreateRecipeResponse>,
						ICreateRecipeRequest
					>(`${RecipeEndpoints.BASE}${RecipeEndpoints.CREATE}`, {
						description: newRecipe.description,
						title: newRecipe.title,
						type: newRecipe.type,
						isVisible: newRecipe.isVisible,
						recipeComposition: productsModal.map(item => ({
							quantity: item.quantity,
							productId: item.productId,
						})),
						creatorId: +userId, //TODO
					})
					return result?.data
				}
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
