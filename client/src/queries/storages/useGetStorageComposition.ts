import { APIInstance } from '@client/queries/API'
import { useInfiniteQuery } from '@tanstack/react-query'

export function useGetStorageComposition(storageId: string | null) {
	return useInfiniteQuery({
		queryKey: ['store'],
		queryFn: async ({ pageParam }) => {
			const { data, error } = await APIInstance.storages.composition.get({
				query: {
					storageId: storageId!,
					cursor: pageParam.cursor,
					take: pageParam.take,
				},
			})
			if (error) throw error
			return data
		},
		initialPageParam: { take: 25, cursor: null } as {
			take: number
			cursor: {
				productId: string
				expireDate: Date
				storageId: string
			} | null
		},
		getNextPageParam: lastPage => {
			if ((lastPage?.composition.length ?? 0) < 25) return
			return {
				cursor: lastPage?.cursor ?? null,
				take: 25,
			}
		},
		refetchOnWindowFocus: true,
		retry: false,
		enabled: !!storageId,
	})
}
