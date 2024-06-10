import { APIInstance } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { useMutation } from '@tanstack/react-query'

export function useDropProduct({ onSuccess }: IDropProductProps) {
	return useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await APIInstance.products({ id }).delete()

			if (error) throw error
			return data
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['products'],
			})
			onSuccess?.()
		},
	})
}

interface IDropProductProps {
	onSuccess?: () => void
}
