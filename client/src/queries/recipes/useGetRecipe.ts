import { APIInstance } from '@client/queries/API'
import { useQuery } from '@tanstack/react-query'

export function useGetRecipe({ id }: { id: string }) {
	return useQuery({
		queryKey: ['recipes', id],
		queryFn: async () => {
			const { data, error } = await APIInstance.recipes.one({ id }).get()
			if (error) throw error
			return data
		},
		refetchOnWindowFocus: false,
		enabled: !!id,
		retry: false,
	})
}
