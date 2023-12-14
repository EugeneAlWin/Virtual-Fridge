import { useMutation } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import UserEndpoints from '../../api/users/endpoints.ts'
import {
	IDeleteUserTokensRequest,
	IDeleteUserTokensResponse,
} from '../../api/users/dto/deleteUserTokens.ts'
import $api from '../axios/base.ts'

export const useLogout = () => {
	const { mutateAsync, isError, error, isSuccess } = useMutation({
		mutationKey: ['login'],
		mutationFn: async ({
			userId,
			devicesId,
		}: {
			userId: number
			devicesId: string[]
		}) => {
			try {
				const result = await $api.delete<
					IDeleteUserTokensResponse,
					AxiosResponse<IDeleteUserTokensResponse>,
					IDeleteUserTokensRequest
				>(`${UserEndpoints.BASE}${UserEndpoints.DELETE_USER_TOKENS}`, {
					data: {
						userId,
						devicesId,
					},
				})
				return result.data
			} catch (e) {
				if (e instanceof AxiosError) return e.response?.data
				return e
			}
		},
	})

	return {
		logout: mutateAsync,
		isLogoutError: isError,
		logoutError: error,
		isLogoutSuccess: isSuccess,
	}
}
