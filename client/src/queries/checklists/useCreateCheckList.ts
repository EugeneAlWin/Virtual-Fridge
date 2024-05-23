import { APIInstance } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { useMutation } from '@tanstack/react-query'

export function useCreateChecklist() {
	return useMutation({
		mutationFn: async (checklist: {
			info: { isConfirmed?: boolean | undefined; creatorId: string }
			composition: {
				productId: string
				price: number
				currency: 'USD' | 'BYN' | 'RUB'
				productQuantity: number
			}[]
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
		},
	})
}
