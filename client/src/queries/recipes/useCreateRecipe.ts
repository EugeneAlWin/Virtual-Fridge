import { APIInstance, STATIC_SERVER } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { EntityType } from '@static/types'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { RecipeTypes } from '~shared/enums'

export function useCreateRecipe({ image, onSuccess }: ICreateRecipeProps) {
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

			if (image && data?.id) {
				const { error: photoError } = await STATIC_SERVER.index.post(
					{ image },
					{
						query: {
							type: EntityType.recipes,
							entityId: data.id,
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
			toast.success('Рецепт создан успешно!')
			onSuccess?.()
		},
	})
}

interface ICreateRecipeProps {
	onSuccess?: () => void
	image?: File
}
