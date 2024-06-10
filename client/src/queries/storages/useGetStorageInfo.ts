import { APIInstance } from '@client/queries/API'
import { useQuery } from '@tanstack/react-query'

export function useGetStorageInfo(creatorId: string | null) {
	return useQuery({
		queryKey: ['storage'],
		queryFn: async () => {
			const { data, error } = await APIInstance.storages.index.get({
				query: { creatorId: creatorId! },
			})
			if (error) throw error
			return data
		},

		refetchOnWindowFocus: true,
		retry: false,
		enabled: !!creatorId,
	})
}
