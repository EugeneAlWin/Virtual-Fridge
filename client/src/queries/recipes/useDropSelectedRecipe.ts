import { APIInstance } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export function useDropSelectedRecipe({ onSuccess }: IDropRecipeProps) {
	return useMutation({
		mutationFn: async ({
			recipeId,
			userId,
		}: {
			recipeId: string
			userId: string
		}) => {
			const { data, error } =
				await APIInstance.recipes.selected.index.delete({
					recipeId,
					userId,
				})

			if (error) throw error
			return data
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['recipes', 'selected'],
			})
			toast.success('Рецепт удален успешно!')
			onSuccess?.()
		},
	})
}

interface IDropRecipeProps {
	onSuccess?: () => void
}
