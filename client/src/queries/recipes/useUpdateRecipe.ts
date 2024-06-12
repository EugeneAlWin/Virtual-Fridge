import { APIInstance, STATIC_SERVER } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { RecipeTypes } from '@prisma/client'
import { EntityType } from '@static/types'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export function useUpdateRecipe({ onSuccess, image }: IUpdateRecipeProps) {
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
			if (image && recipe.info.id) {
				const { error: photoError } = await STATIC_SERVER.index.post(
					{ image },
					{
						query: {
							type: EntityType.recipes,
							entityId: recipe.info.id,
						},
					}
				)
				if (photoError) throw photoError
			}
			if (error) throw error
			return data
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['recipes'],
			})
			toast.success('Рецепт обновлен успешно!')
			onSuccess?.()
		},
	})
}

interface IUpdateRecipeProps {
	onSuccess?: () => void
	image?: File
}
