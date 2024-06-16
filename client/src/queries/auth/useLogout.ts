import { APIInstance } from '@client/queries/API'
import { useMutation } from '@tanstack/react-query'

export const useLogout = () => {
	return useMutation({
		mutationKey: ['logout'],
		mutationFn: async (device: { userId: string; deviceId: string }) => {
			const { data, error } = await APIInstance.users.signout.delete(device)
			if (error) throw error
			return data
		},
	})
}
