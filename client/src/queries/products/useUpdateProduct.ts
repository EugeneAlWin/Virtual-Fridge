import { APIInstance } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { useMutation } from '@tanstack/react-query'

export function useUpdateProduct() {
	return useMutation({
		mutationFn: async (selectedProduct: {
			isFrozen?: boolean
			title?: string
			calories?: number
			protein?: number
			fats?: number
			carbohydrates?: number
			id: string
		}) => {
			const { data, error } =
				await APIInstance.products.index.patch(selectedProduct)
			if (error) throw error
			return data
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['products'],
			})
			await queryClient.invalidateQueries({
				queryKey: ['recipes'],
			})
		},
	})
}
