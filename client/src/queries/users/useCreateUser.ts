import { APIInstance } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import cuid2 from '@paralleldrive/cuid2'
import { Roles } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export function useCreateUser({ onSuccess }: ICreateUserProps) {
	return useMutation({
		mutationFn: async (newUser: {
			isFrozen?: boolean
			isBlocked?: boolean
			login: string
			password: string
			role: Roles
		}) => {
			const { data, error } = await APIInstance.users.create.post({
				...newUser,
				deviceId: cuid2.createId(),
			})
			if (error) throw error
			return data
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['users'],
			})
			toast.success('Пользователь создан успешно!')
			onSuccess?.()
		},
	})
}

interface ICreateUserProps {
	onSuccess?: () => void
}
