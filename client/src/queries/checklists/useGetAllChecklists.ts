import { APIInstance } from '@client/queries/API'
import { useInfiniteQuery } from '@tanstack/react-query'

export function useGetAllChecklists({ createdAt }: { createdAt?: Date }) {
	return useInfiniteQuery({
		queryKey: ['checklists', createdAt],
		queryFn: async ({ pageParam }) => {
			const { data, error } = await APIInstance.checklists.index.get({
				query: {
					...(pageParam.cursor && { cursor: pageParam.cursor }),
					...(createdAt && { createdAt }),
					...(pageParam.take && { take: pageParam.take }),
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
			if ((lastPage?.lists?.length ?? 0) < 25) return
			return {
				cursor: lastPage?.cursor ?? null,
				take: 25,
			}
		},
		retry: false,
	})
}
