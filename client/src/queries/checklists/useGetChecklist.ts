import { APIInstance } from '@client/queries/API'
import { useQuery } from '@tanstack/react-query'

export function useGetChecklist(id: string) {
	return useQuery({
		queryKey: ['checklist'],
		queryFn: async () => {
			const { data, error } = await APIInstance.checklists({ id }).get()

			if (error) throw error
			return data
		},
		refetchOnWindowFocus: false,
		retry: false,
	})
}
