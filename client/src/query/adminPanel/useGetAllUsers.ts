import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { IGetAllUsersResponse } from '../../api/users/dto/getAllUsers.ts'
import { IErrorResponse } from '../../api/errorResponse.ts'
import $api from '../axios/base.ts'
import axios, { AxiosResponse } from 'axios'
import UserEndpoints from '../../api/users/endpoints.ts'

export function useGetAllUsers() {
	const { data, error, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<
		IGetAllUsersResponse,
		IErrorResponse,
		InfiniteData<IGetAllUsersResponse>,
		string[],
		{ pageSize: number | undefined; cursor: number | null }
	>({
		queryKey: ['users'],
		queryFn: async ({ pageParam }) => {
			try {
				const result = await $api.get<
					IGetAllUsersResponse,
					AxiosResponse<IGetAllUsersResponse>
				>(`${UserEndpoints.BASE}${UserEndpoints.GET_ALL_USERS}`, {
					params: {
						skip: 0,
						take: pageParam?.pageSize || 25,
						cursor: pageParam?.cursor,
						isArchived: false,
						isBanned: false,
					},
				})
				return { usersData: result.data?.usersData, cursor: result.data?.cursor }
			} catch (e) {
				if (axios.isAxiosError(e)) throw e?.response?.data
				throw e
			}
		},
		refetchOnWindowFocus: false,
		initialPageParam: { pageSize: 25, cursor: null },
		getNextPageParam: lastPage => {
			if (lastPage.usersData.length < 25) return
			return {
				cursor: lastPage?.cursor ? lastPage.cursor + 1 : null,
				pageSize: 25,
			}
		},
		retry: false,
	})

	return {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isLoading,
	}
}
