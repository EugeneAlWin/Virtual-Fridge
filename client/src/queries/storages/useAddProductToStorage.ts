import { APIInstance } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export function useAddProductToStorage({
	onSuccess,
}: IAddProductToStorageProps) {
	return useMutation({
		mutationFn: async ({
			storageId,
			productQuantity,
			productId,
		}: {
			productId: string
			productQuantity: number
			storageId: string
		}) => {
			const { data, error } = await APIInstance.storages.add.put({
				productId,
				productQuantity,
				storageId,
				expireDate: undefined,
			})

			if (error) throw error
			return data
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['storage'],
			})
			toast.success('Продукт добавлен успешно!')
			onSuccess?.()
		},
	})
}

interface IAddProductToStorageProps {
	onSuccess?: () => void
}
