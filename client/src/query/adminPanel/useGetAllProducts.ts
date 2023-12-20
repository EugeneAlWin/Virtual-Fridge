import { IGetAllProductsResponse } from '../../api/products/dto/getAllProducts.ts'
import { IErrorResponse } from '../../api/errorResponse.ts'
import $api from '../axios/base.ts'
import axios, { AxiosResponse } from 'axios'
import ProductEndpoints from '../../api/products/endpoints.ts'
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

export function useGetAllProducts() {
	const { data, hasNextPage, fetchNextPage } = useInfiniteQuery<
		IGetAllProductsResponse,
		IErrorResponse,
		InfiniteData<IGetAllProductsResponse>,
		string[],
		{ pageSize: number | undefined; cursor: number | null }
	>({
		queryKey: ['products'],
		queryFn: async ({ pageParam }) => {
			try {
				const result = await $api.get<
					IGetAllProductsResponse,
					AxiosResponse<IGetAllProductsResponse>
				>(`${ProductEndpoints.BASE}${ProductEndpoints.GET_ALL_PRODUCTS}`, {
					params: {
						skip: 0,
						take: pageParam?.pageSize || 25,
						cursor: pageParam?.cursor,
					},
				})
				return {
					productsData: result.data?.productsData,
					cursor: result.data?.cursor,
				}
			} catch (e) {
				if (axios.isAxiosError(e)) throw e?.response?.data
				throw e
			}
		},
		refetchOnWindowFocus: false,
		initialPageParam: { pageSize: 25, cursor: null },
		getNextPageParam: lastPage => {
			if (lastPage.productsData.length < 25) return
			return {
				cursor: lastPage?.cursor ? lastPage.cursor + 1 : null,
				pageSize: 25,
			}
		},
		retry: false,
	})
	return {
		data,
		hasNextPage,
		fetchNextPage,
	}
}
