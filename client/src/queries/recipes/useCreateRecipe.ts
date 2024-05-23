import { APIInstance } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { RecipeTypes } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'

export function useCreateRecipe() {
	return useMutation({
		mutationFn: async (newRecipe: {
			info: {
				creatorId: string
				title: string
				type: RecipeTypes
				description?: string
				isPrivate?: boolean
				isOfficial?: boolean
				isFrozen?: boolean
			}
			composition: {
				productId: string
				quantity: number
			}[]
		}) => {
			const { data, error } = await APIInstance.recipes.index.post(newRecipe)

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
