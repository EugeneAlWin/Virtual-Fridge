import { APIInstance } from '@client/queries/API'
import cuid2 from '@paralleldrive/cuid2'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export const useAuth = () => {
	return useMutation({
		mutationKey: ['auth'],
		mutationFn: async ({
			login,
			password,
		}: {
			login: string
			password: string
		}) => {
			const { data, error } = await APIInstance.users.signin.post({
				login,
				password,
				deviceId: cuid2.createId(),
			})
			if (error) throw error
			return data
		},
		onError() {
			toast.error('Неверный логин или пароль')
		},
		retry: false,
	})
}
