import {
	ICreateProductRequest,
	ICreateProductResponse,
} from '../../api/products/dto/createProduct.ts'
import { IErrorResponse } from '../../api/errorResponse.ts'
import $api from '../axios/base.ts'
import axios, { AxiosResponse } from 'axios'
import ProductEndpoints from '../../api/products/endpoints.ts'
import queryClient from '../queryClient.ts'
import { useMutation } from '@tanstack/react-query'
import useVirtualStore from '../../storage'

export function useCreateProduct() {
	const { userId } = useVirtualStore()

	return useMutation<ICreateProductResponse, IErrorResponse, ICreateProductRequest>({
		mutationFn: async newProduct => {
			try {
				const result = await $api.post<
					ICreateProductResponse,
					AxiosResponse<ICreateProductResponse>,
					ICreateProductRequest
				>(`${ProductEndpoints.BASE}${ProductEndpoints.CREATE_PRODUCT}`, {
					calories: newProduct.calories,
					fats: newProduct.fats,
					carbohydrates: newProduct.carbohydrates,
					protein: newProduct.protein,
					title: newProduct.title,
					creatorId: +userId!,
					units: newProduct.units,
				})
				return result.data
			} catch (e) {
				if (axios.isAxiosError(e)) throw e?.response?.data
				throw e
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['products'],
			})
			await queryClient.invalidateQueries({
				queryKey: ['recipes'],
			})
		},
	})
}
