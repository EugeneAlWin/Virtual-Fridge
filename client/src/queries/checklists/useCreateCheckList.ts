import { APIInstance } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export function useCreateChecklist({ onSuccess }: ICreateChecklistProps) {
	return useMutation({
		mutationFn: async (checklist: {
			userId: string
			subtractStorage: boolean
			recipesId: string[]
		}) => {
			const { data, error } =
				await APIInstance.checklists.index.post(checklist)

			if (error) throw error
			return data
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['checklist'],
			})
			toast.success('Список создан успешно!')
			onSuccess?.()
		},
	})
}

interface ICreateChecklistProps {
	onSuccess?: () => void
}
