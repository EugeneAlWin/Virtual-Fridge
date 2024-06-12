import { APIInstance } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export function useSetStorageComposition({
	onSuccess,
}: ISetStorageComposition) {
	return useMutation({
		mutationFn: async ({
			storeComposition,
		}: {
			storeComposition: {
				expireDate?: Date
				purchaseDate?: Date
				productId: string
				productQuantity: number
				storageId: string
			}[]
		}) => {
			const { data, error } =
				await APIInstance.storages.composition.patch(storeComposition)

			if (error) throw error
			return data
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['storage'],
			})
			toast.success('Хранилище обновлено успешно!')
			onSuccess?.()
		},
	})
}

interface ISetStorageComposition {
	onSuccess?: () => void
}
