import { APIInstance } from '@client/queries/API'
import { useInfiniteQuery } from '@tanstack/react-query'

export function useGetAllRecipes({ title }: { title?: string }) {
	return useInfiniteQuery({
		queryKey: ['recipes', title],
		queryFn: async ({ pageParam }) => {
			const { data, error } = await APIInstance.recipes.index.get({
				query: {
					...(pageParam.cursor && { cursor: pageParam.cursor }),
					take: pageParam.take,
					...(title && { title }),
				},
			})
			if (error) throw error
			return data
		},
		refetchOnWindowFocus: false,
		initialPageParam: { take: 25, cursor: null } as {
			take: number
			cursor: string | null
		},
		getNextPageParam: lastPage => {
			if (lastPage.recipes?.length < 25) return
			return {
				cursor: lastPage?.cursor ? lastPage.cursor : null,
				take: 25,
			}
		},
		retry: false,
	})
}
