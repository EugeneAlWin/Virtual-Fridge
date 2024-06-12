import { APIInstance } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export function useUpdateChecklist({ onSuccess }: IUpdateChecklistProps) {
	return useMutation({
		mutationFn: async (checklist: {
			checklistId: string
			userId: string
			products: { id: string; quantity: number }[]
		}) => {
			const { data, error } =
				await APIInstance.checklists.index.patch(checklist)

			if (error) throw error
			return data
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['checklist'],
			})
			toast.success('Список обновлен успешно!')
			onSuccess?.()
		},
	})
}

interface IUpdateChecklistProps {
	onSuccess?: () => void
}
