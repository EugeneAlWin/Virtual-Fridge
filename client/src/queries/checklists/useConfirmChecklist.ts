import { APIInstance } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export function useConfirmChecklist({ onSuccess }: IConfirmChecklistProps) {
	return useMutation({
		mutationFn: async (checklist: {
			userId: string
			checklistId: string
		}) => {
			const { data, error } =
				await APIInstance.checklists.confirm.patch(checklist)

			if (error) throw error
			return data
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['checklists'],
			})
			await queryClient.invalidateQueries({
				queryKey: ['storage'],
			})
			toast.success('Хранилище обновлено. Покупка подтверждена!')
			onSuccess?.()
		},
	})
}

interface IConfirmChecklistProps {
	onSuccess?: () => void
}
