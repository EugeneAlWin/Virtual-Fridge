import { APIInstance } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { Roles } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'

export type SelectedUser = {
	login?: string
	password?: string
	role?: Roles
	isFrozen?: boolean
	isBlocked?: boolean
	id: string
}

export function useUpdateUser() {
	return useMutation({
		mutationFn: async (user: SelectedUser) => {
			const { error, data } = await APIInstance.users.update.patch(user)
			if (error) throw error

			return data
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['users'],
			})
		},
	})
}
