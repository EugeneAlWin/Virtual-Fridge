import { APIInstance } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { useMutation } from '@tanstack/react-query'

export function useDropUser() {
	return useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await APIInstance.users({ id }).delete()

			if (error) throw error
			return data
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['users'],
			})
		},
	})
}
