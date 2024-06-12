import { APIInstance } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export function useDropRecipe({ onSuccess }: IDropRecipeProps) {
	return useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await APIInstance.recipes({ id }).delete()

			if (error) throw error
			return data
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['recipes'],
			})
			toast.success('Рецепт удален успешно!')
			onSuccess?.()
		},
	})
}

interface IDropRecipeProps {
	onSuccess?: () => void
}
