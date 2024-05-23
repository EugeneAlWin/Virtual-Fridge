import { APIInstance } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { useMutation } from '@tanstack/react-query'

export function useSetStorageComposition() {
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
				queryKey: ['store'],
			})
		},
	})
}
