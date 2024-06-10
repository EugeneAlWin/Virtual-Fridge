import { APIInstance } from '@client/queries/API'
import { useInfiniteQuery } from '@tanstack/react-query'

export function useGetStorageComposition(storageId?: string | null) {
	return useInfiniteQuery({
		queryKey: ['storage', storageId],
		queryFn: async ({ pageParam }) => {
			const { data, error } = await APIInstance.storages.composition.get({
				query: {
					storageId: storageId!,
					...(pageParam.cursor && { cursor: pageParam.cursor }),
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
			if ((lastPage?.composition?.length ?? 0) < 25) return
			return {
				cursor: null,
				take: 25,
			}
		},
		refetchOnWindowFocus: false,
		retry: false,
		enabled: !!storageId,
	})
}
