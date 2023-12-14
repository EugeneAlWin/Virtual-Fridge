import $api from '../axios/base.ts'
import UserEndpoints from '../../api/users/endpoints.ts'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { IErrorResponse } from '../../api/errorResponse.ts'
import { ILoginUserRequest, ILoginUserResponse } from '../../api/users/dto/loginUser.ts'
import { v4 } from 'uuid'

export const useAuth = () => {
	const { data, mutateAsync, error, isSuccess, isError } = useMutation({
		mutationKey: ['login'],
		mutationFn: async ({ login, password }: { login: string; password: string }) => {
			const result = await $api.post<
				AxiosResponse<IErrorResponse>,
				AxiosResponse<ILoginUserResponse>,
				ILoginUserRequest
			>(`${UserEndpoints.BASE}${UserEndpoints.LOGIN}`, {
				login,
				password,
				deviceId: v4(),
			})
			return result.data
		},
		retry: false,
	})

	return {
		data,
		loginUser: mutateAsync,
		error,
		isLoginSuccess: isSuccess,
		isLoginError: isError,
	}
}
