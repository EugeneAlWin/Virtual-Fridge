import $api from '../axios/base.ts'
import UserEndpoints from '../../api/users/endpoints.ts'
import { v4 } from 'uuid'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { IErrorResponse } from '../../api/errorResponse.ts'
import {
	ICreateUserRequest,
	ICreateUserResponse,
} from '../../api/users/dto/createUser.ts'
import {
	ICreateUserTokenRequest,
	ICreateUserTokenResponse,
} from '../../api/users/dto/createUserToken.ts'
import { Roles } from '../../api/enums.ts'

export const useRegistration = () => {
	const { data, mutateAsync, error, isSuccess, isError } = useMutation({
		mutationKey: ['login'],
		mutationFn: async ({ password, login }: { password: string; login: string }) => {
			const user = await $api.post<
				AxiosResponse<IErrorResponse>,
				AxiosResponse<ICreateUserResponse>,
				ICreateUserRequest
			>(
				`${UserEndpoints.BASE}${UserEndpoints.CREATE_USER}`,
				{ password, login, role: 'DEFAULT' },
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)
			if (!user) throw Error('Cannot create user')
			const userData = user.data
			const result = await $api.post<
				AxiosResponse<IErrorResponse>,
				AxiosResponse<ICreateUserTokenResponse>,
				ICreateUserTokenRequest
			>(`${UserEndpoints.BASE}${UserEndpoints.CREATE_USER_TOKEN}`, {
				userId: userData.id,
				deviceId: v4(),
				role: Roles.DEFAULT,
				login,
				password,
			})
			return { ...userData, ...result.data }
		},
		retry: false,
	})

	return {
		data,
		registerUser: mutateAsync,
		error,
		isSuccessRegistration: isSuccess,
		isRegistrationError: isError,
	}
}
