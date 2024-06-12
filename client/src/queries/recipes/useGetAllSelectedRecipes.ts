import { APIInstance } from '@client/queries/API'
import { useInfiniteQuery } from '@tanstack/react-query'

export function useGetAllSelectedRecipes({
	title,
	userId,
}: {
	title?: string
	userId: string
}) {
	return useInfiniteQuery({
		queryKey: ['recipes', 'selected', title],
		queryFn: async ({ pageParam }) => {
			const { data, error } = await APIInstance.recipes.selected.index.get({
				query: {
					userId,
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
