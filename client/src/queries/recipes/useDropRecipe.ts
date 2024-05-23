import { APIInstance } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { useMutation } from '@tanstack/react-query'

export function useDropRecipe() {
	return useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await APIInstance.recipes({ id }).delete()

			if (error) throw error
			return data
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['recipes'],
			})
		},
	})
}
