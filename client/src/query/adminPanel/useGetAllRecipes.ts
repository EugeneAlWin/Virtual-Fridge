import { IGetAllRecipesResponse } from '../../api/recipes/dto/getAllRecipes.ts'
import { IErrorResponse } from '../../api/errorResponse.ts'
import $api from '../axios/base.ts'
import axios, { AxiosResponse } from 'axios'
import RecipeEndpoints from '../../api/recipes/endpoints.ts'
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

export function useGetAllRecipes() {
	return useInfiniteQuery<
		IGetAllRecipesResponse,
		IErrorResponse,
		InfiniteData<IGetAllRecipesResponse>,
		string[],
		{
			pageSize: number
			cursor: { recipeId: number; productId: number } | null
		}
	>({
		queryKey: ['recipes'],
		queryFn: async ({ pageParam }) => {
			try {
				const result = await $api.get<
					IGetAllRecipesResponse,
					AxiosResponse<IGetAllRecipesResponse>
				>(`${RecipeEndpoints.BASE}${RecipeEndpoints.GET_ALL}`, {
					params: {
						skip: 0,
						take: pageParam?.pageSize || 25,
						cursor: pageParam?.cursor,
						isVisible: false,
						isApproved: false,
					},
				})
				return { recipesData: result.data?.recipesData, cursor: result.data?.cursor }
			} catch (e) {
				if (axios.isAxiosError(e)) throw e?.response?.data
				throw e
			}
		},
		refetchOnWindowFocus: false,
		initialPageParam: { pageSize: 25, cursor: null },
		getNextPageParam: lastPage => {
			if (lastPage.recipesData?.length < 25) return
			return {
				cursor: lastPage?.cursor ? lastPage.cursor : null,
				pageSize: 25,
			}
		},
		retry: false,
	})
}
