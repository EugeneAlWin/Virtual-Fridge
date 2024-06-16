import { APIInstance } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export function useUpdateUser({ onSuccess }: IUpdateUserProps) {
	return useMutation({
		mutationFn: async (user: {
			id: string
			login?: string
			password?: string
			isFrozen?: boolean
			isBlocked?: boolean
		}) => {
			const { error, data } = await APIInstance.users.update.patch(user)
			if (error) throw error

			return data
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['users'],
			})
			toast.success('Пользователь обновлен успешно!')
			onSuccess?.()
		},
	})
}

interface IUpdateUserProps {
	onSuccess?: () => void
}
