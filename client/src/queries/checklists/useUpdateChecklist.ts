import { APIInstance } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { Currencies } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'

export function useUpdateChecklist() {
	return useMutation({
		mutationFn: async (checklist: {
			composition?: {
				productId: string
				price: number
				currency: Currencies
				productQuantity: number
			}[]
			info: {
				isConfirmed?: boolean
				creatorId: string
				checklistId: string
			}
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
		},
	})
}
