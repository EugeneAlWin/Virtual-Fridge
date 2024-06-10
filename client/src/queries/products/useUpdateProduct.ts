import { APIInstance, STATIC_SERVER } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { Units } from '@prisma/client'
import { EntityType } from '@static/types'
import { useMutation } from '@tanstack/react-query'

export function useUpdateProduct({ onSuccess, image }: IUpdateProductProps) {
	return useMutation({
		mutationFn: async (selectedProduct: {
			isFrozen?: boolean
			title?: string
			calories?: number
			protein?: number
			fats?: number
			carbohydrates?: number
			id: string
			isOfficial?: boolean
			averageShelfLifeInDays?: number
			isRecipePossible?: boolean
			unit?: Units
		}) => {
			const { data, error } =
				await APIInstance.products.index.patch(selectedProduct)
			if (error) throw error
			if (image) {
				const { error: uploadError } = await STATIC_SERVER.index.post(
					{ image },
					{
						query: {
							type: EntityType.products,
							entityId: selectedProduct.id,
						},
					}
				)
				if (uploadError) throw error
			}
			return { data, imageUploaded: image ? true : undefined }
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['products'],
			})
			await queryClient.invalidateQueries({
				queryKey: ['recipes'],
			})
			onSuccess?.()
		},
	})
}

interface IUpdateProductProps {
	onSuccess?: () => void
	image?: File
}
