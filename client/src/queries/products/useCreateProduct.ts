import { APIInstance, STATIC_SERVER } from '@client/queries/API'
import queryClient from '@client/queries/queryClient'
import { Units } from '@prisma/client'
import { EntityType } from '@static/types'
import { useMutation } from '@tanstack/react-query'

export function useCreateProduct({ onSuccess, image }: ICreateProductProps) {
	return useMutation({
		mutationFn: async (product: {
			averageShelfLifeInDays?: number
			isFrozen: boolean
			title: string
			creatorId: string
			calories: number
			protein: number
			fats: number
			carbohydrates: number
			unit: Units
			isOfficial: boolean
			isRecipePossible: boolean
		}) => {
			const { data, error } = await APIInstance.products.index.post(product)
			if (error) throw error

			if (image && data.id) {
				const { error: photoError } = await STATIC_SERVER.index.post(
					{ image },
					{
						query: {
							type: EntityType.products,
							entityId: data.id,
						},
					}
				)
				if (photoError) throw photoError
			}

			return { data, photoUploaded: image ? true : undefined }
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

interface ICreateProductProps {
	onSuccess?: () => void
	image?: File
}
