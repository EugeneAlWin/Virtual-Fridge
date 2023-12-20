import $api from '../axios/base.ts'
import { IDeleteProductsResponse } from '../../api/products/dto/deleteProduct.ts'
import ProductEndpoints from '../../api/products/endpoints.ts'
import axios from 'axios'
import queryClient from '../queryClient.ts'
import { useMutation } from '@tanstack/react-query'
import { IErrorResponse } from '../../api/errorResponse.ts'

export function useDropProduct() {
	const { mutateAsync: dropProduct } = useMutation<
		IDeleteProductsResponse,
		IErrorResponse,
		number
	>({
		mutationFn: async id => {
			try {
				const result = await $api.delete<IDeleteProductsResponse>(
					`${ProductEndpoints.BASE}${ProductEndpoints.DELETE_PRODUCT}`,
					{
						data: {
							productsId: [id],
						},
					}
				)
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
		},
	})
	return {
		dropProduct,
	}
}
