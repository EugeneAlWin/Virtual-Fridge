import { useMutation } from '@tanstack/react-query'
import $api from '../axios/base.ts'
import {
	IUpdateUserDataRequest,
	IUpdateUserDataResponse,
} from '../../api/users/dto/updateUserData.ts'
import axios, { AxiosResponse } from 'axios'
import UserEndpoints from '../../api/users/endpoints.ts'
import queryClient from '../queryClient.ts'
import { IErrorResponse } from '../../api/errorResponse.ts'

export type SelectedUser = {
	userId?: number
	login?: string
	isBanned?: boolean
	isArchived?: boolean
	password?: string
} | null

export function useUpdateUser() {
	return useMutation<IUpdateUserDataResponse | void, IErrorResponse, SelectedUser>({
		mutationFn: async (selectedUser: SelectedUser) => {
			try {
				if (!selectedUser || !selectedUser.userId) return
				const result = await $api.patch<
					IUpdateUserDataResponse,
					AxiosResponse<IUpdateUserDataResponse>,
					IUpdateUserDataRequest
				>(`${UserEndpoints.BASE}${UserEndpoints.UPDATE_USER_DATA}`, {
					userId: selectedUser.userId,
					login: selectedUser.login || undefined,
					password: selectedUser.password || undefined,
					isBanned: selectedUser.isBanned,
					isArchived: selectedUser.isArchived,
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
