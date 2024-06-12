import { APIInstance } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export function useDropProductFromStorage({
	onSuccess,
}: ISetStorageComposition) {
	return useMutation({
		mutationFn: async (productToDrop: {
			storageId: string
			productId: string
		}) => {
			const { data, error } =
				await APIInstance.storages.remove.delete(productToDrop)

			if (error) throw error
			return data
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['storage'],
			})
			toast.success('Продукт удален успешно!')
			onSuccess?.()
		},
	})
}

interface ISetStorageComposition {
	onSuccess?: () => void
}
