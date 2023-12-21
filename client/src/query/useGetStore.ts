import { IGetStoreByUserIdResponse } from '../api/stores/dto/getStoreByUserId.ts'
import { IErrorResponse } from '../api/errorResponse.ts'
import $api from './axios/base.ts'
import StoreEndpoints from '../api/stores/endpoints.ts'
import { AxiosResponse, isAxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'

export function useGetStore(userId: string | null) {
	return useQuery<
		IGetStoreByUserIdResponse,
		IErrorResponse,
		IGetStoreByUserIdResponse,
		string[]
	>({
		queryKey: ['store'],
		queryFn: async () => {
			try {
				const result = await $api.get<
					IGetStoreByUserIdResponse,
					AxiosResponse<IGetStoreByUserIdResponse>
				>(`${StoreEndpoints.BASE}${StoreEndpoints.GET_BY_ID}`, {
					params: {
						creatorId: +userId!,
					},
				})
				return result.data
			} catch (e) {
				if (isAxiosError(e)) throw e?.response?.data
				throw e
			}
		},
		refetchOnWindowFocus: true,
		retry: false,
		enabled: !!userId,
	})
}
