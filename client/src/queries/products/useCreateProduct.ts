import { APIInstance } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { Units } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'

export function useCreateProduct() {
	return useMutation({
		mutationFn: async (newProduct: {
			averageShelfLifeInDays?: number
			isFrozen: boolean
			title: string
			creatorId: string
			calories: number
			protein: number
			fats: number
			carbohydrates: number
			unit: Units
			isOfficial: boolean
			isRecipePossible: boolean
		}) => {
			const { data, error } =
				await APIInstance.products.index.post(newProduct)

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
