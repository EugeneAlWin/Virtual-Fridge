import { APIInstance } from '@client/queries/API'
import { useInfiniteQuery } from '@tanstack/react-query'

export function useGetAllUsers({ login }: { login?: string }) {
	return useInfiniteQuery({
		queryKey: ['users', login],
		queryFn: async ({ pageParam }) => {
			const { data, error } = await APIInstance.users.index.get({
				query: {
					...(login && { login }),
					...(pageParam.cursor && { cursor: pageParam.cursor }),
					take: pageParam.take,
				},
			})
			if (error) throw error
			return data
		},
		initialPageParam: { take: 25, cursor: null } as {
			take: number
			cursor: string | null
		},
		getNextPageParam: lastPage => {
			if ((lastPage?.users?.length ?? 0) < 25) return
			return {
				cursor: lastPage?.cursor ?? null,
				take: 25,
			}
		},
	})
}
