import { APIInstance } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { RecipeTypes } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'

export function useUpdateRecipe() {
	return useMutation({
		mutationFn: async (recipe: {
			info: {
				isFrozen?: boolean
				isOfficial?: boolean
				isPrivate?: boolean
				type: RecipeTypes
				id: string
				title: string
				description: string
			}
			composition?: { productId: string; quantity: number }[]
		}) => {
			const { data, error } = await APIInstance.recipes.index.patch({
				info: recipe.info,
				composition: recipe.composition,
			})
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
