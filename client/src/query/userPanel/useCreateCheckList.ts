import { useMutation } from '@tanstack/react-query'
import {
	ICreateChecklistRequest,
	ICreateChecklistResponse,
} from '../../api/checklists/dto/createChecklist.ts'
import { IErrorResponse } from '../../api/errorResponse.ts'
import { ChecklistCompositionData } from '../../api/checklists/common.ts'
import $api from '../axios/base.ts'
import axios, { AxiosResponse } from 'axios'
import ChecklistEndpoints from '../../api/checklists/endpoints.ts'
import queryClient from '../queryClient.ts'

export function useCreateChecklist(userId: string | null) {
	return useMutation<
		ICreateChecklistResponse | void,
		IErrorResponse,
		ChecklistCompositionData[]
	>({
		mutationFn: async data => {
			try {
				if (!userId) return
				const result = await $api.post<
					ICreateChecklistResponse,
					AxiosResponse<ICreateChecklistResponse>,
					ICreateChecklistRequest
				>(`${ChecklistEndpoints.BASE}${ChecklistEndpoints.CREATE}`, {
					creatorId: +userId,
					checklistComposition: data,
					checklistPrices: {
						//TODO deal with money
						BYN: 3,
						RUB: 3,
						USD: 3,
					},
				})
				return result.data
			} catch (e) {
				if (axios.isAxiosError(e)) throw e?.response?.data
				throw e
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['checklist'],
			})
		},
	})
}
