import { APIInstance } from '@client/queries/API'
import cuid2 from '@paralleldrive/cuid2'
import { useMutation } from '@tanstack/react-query'

export const useRegistration = () => {
	return useMutation({
		mutationKey: ['registration'],
		mutationFn: async ({
			password,
			login,
		}: {
			password: string
			login: string
		}) => {
			const { data, error } = await APIInstance.users.signup.post({
				login,
				password,
				deviceId: cuid2.createId(),
			})
			if (error) throw error
			return data
		},
		retry: false,
	})
}
