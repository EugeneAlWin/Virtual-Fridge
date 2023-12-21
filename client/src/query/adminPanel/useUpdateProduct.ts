import {
	IUpdateProductRequest,
	IUpdateProductResponse,
} from '../../api/products/dto/updateProduct.ts'
import { IErrorResponse } from '../../api/errorResponse.ts'
import $api from '../axios/base.ts'
import axios, { AxiosResponse } from 'axios'
import ProductEndpoints from '../../api/products/endpoints.ts'
import queryClient from '../queryClient.ts'
import { useMutation } from '@tanstack/react-query'

export function useUpdateProduct() {
	return useMutation<IUpdateProductResponse, IErrorResponse, IUpdateProductRequest>({
		mutationFn: async selectedProduct => {
			try {
				const result = await $api.patch<
					IUpdateProductResponse,
					AxiosResponse<IUpdateProductResponse>,
					IUpdateProductRequest
				>(`${ProductEndpoints.BASE}${ProductEndpoints.UPDATE_PRODUCT}`, {
					calories: selectedProduct?.calories,
					fats: selectedProduct?.fats,
					carbohydrates: selectedProduct?.carbohydrates,
					protein: selectedProduct?.protein,
					title: selectedProduct?.title,
					id: selectedProduct.id,
					units: selectedProduct?.units,
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
