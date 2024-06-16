import { APIInstance } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

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
			toast.success('Продукт удален успешно!')
			onSuccess?.()
		},
	})
}

interface IDropProductProps {
	onSuccess?: () => void
}
