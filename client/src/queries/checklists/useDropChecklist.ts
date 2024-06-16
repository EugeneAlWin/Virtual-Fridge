import { APIInstance } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export function useUpdateChecklist({ onSuccess }: IDropChecklistProps) {
	return useMutation({
		mutationFn: async ({ checklistId }: { checklistId: string }) => {
			const { data, error } = await APIInstance.checklists
				.drop({ id: checklistId })
				.delete()

			if (error) throw error
			return data
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['checklists'],
			})
			toast.success('Список удален успешно!')
			onSuccess?.()
		},
	})
}

interface IDropChecklistProps {
	onSuccess?: () => void
}
