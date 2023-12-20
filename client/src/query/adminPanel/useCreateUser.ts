import { useMutation } from '@tanstack/react-query'
import $api from '../axios/base.ts'
import {
	ICreateUserRequest,
	ICreateUserResponse,
} from '../../api/users/dto/createUser.ts'
import axios, { AxiosResponse } from 'axios'
import UserEndpoints from '../../api/users/endpoints.ts'
import queryClient from '../queryClient.ts'
import { IErrorResponse } from '../../api/errorResponse.ts'

export function useCreateUser() {
	return useMutation<ICreateUserResponse, IErrorResponse, ICreateUserRequest>({
		mutationFn: async (newUser: ICreateUserRequest) => {
			try {
				const result = await $api.post<
					ICreateUserResponse,
					AxiosResponse<ICreateUserResponse>,
					ICreateUserRequest
				>(`${UserEndpoints.BASE}${UserEndpoints.CREATE_USER}`, {
					login: newUser.login,
					password: newUser.password,
					role: newUser.role,
				})
				return result.data
			} catch (e) {
				if (axios.isAxiosError(e)) throw e?.response?.data
				throw e
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['users'],
			})
		},
	})
}
