import $api from '../axios/base.ts'
import { IDeleteProductsResponse } from '../../api/products/dto/deleteProduct.ts'
import RecipeEndpoints from '../../api/recipes/endpoints.ts'
import axios from 'axios'
import queryClient from '../queryClient.ts'
import { useMutation } from '@tanstack/react-query'

export function useDropRecipe() {
	return useMutation({
		mutationFn: async (id: number) => {
			try {
				const result = await $api.delete<IDeleteProductsResponse>(
					`${RecipeEndpoints.BASE}${RecipeEndpoints.DELETE}`,
					{
						data: {
							recipesId: [id],
						},
					}
				)
				return result.data.count
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
