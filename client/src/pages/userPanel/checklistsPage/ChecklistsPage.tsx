import { useMutation, useQuery } from '@tanstack/react-query'
import { IErrorResponse } from '../../../api/errorResponse.ts'
import $api from '../../../query/axios/base.ts'
import axios, { AxiosResponse } from 'axios'
import styles from './checklistsPage.module.scss'
import { IGetAllChecklistsPreviewResponse } from '../../../api/checklists/dto/getAllChecklists.ts'
import ChecklistEndpoints from '../../../api/checklists/endpoints.ts'
import {
	IUpdateChecklistRequest,
	IUpdateChecklistResponse,
} from '../../../api/checklists/dto/updateChecklist.ts'
import queryClient from '../../../query/queryClient.ts'
import { useNavigate } from 'react-router-dom'
import { IGetStoreByUserIdResponse } from '../../../api/stores/dto/getStoreByUserId.ts'
import StoreEndpoints from '../../../api/stores/endpoints.ts'
import {
	IUpdateStoreRequest,
	IUpdateStoreResponse,
} from '../../../api/stores/dto/updateStore.ts'
import useVirtualStore from '../../../storage'
import { Currencies } from '../../../api/enums.ts'
import { useGetStore } from '../../../query/userPanel/useGetStore.ts'

export const UserChecklistsPage = () => {
	const { userId } = useVirtualStore()

	const navigate = useNavigate()
	const { data, error, isLoading } = useQuery<
		IGetAllChecklistsPreviewResponse,
		IErrorResponse,
		IGetAllChecklistsPreviewResponse,
		['checklists']
	>({
		queryKey: ['checklists'],
		queryFn: async () => {
			try {
				const result = await $api.get<
					AxiosResponse<IErrorResponse>,
					AxiosResponse<IGetAllChecklistsPreviewResponse>
				>(`${ChecklistEndpoints.BASE}${ChecklistEndpoints.GET_ALL_PREVIEW}`, {
					params: {
						skip: 0,
						take: 25,
						creatorId: +userId!,
					},
				})
				return result.data
			} catch (e) {
				if (axios.isAxiosError(e)) throw e?.response?.data
				throw e
			}
		},
		refetchOnWindowFocus: false,
		retry: false,
	})

	const { data: storeData } = useGetStore(userId)

	const { mutateAsync: updateChecklist } = useMutation({
		mutationFn: async ({
			id,
			isConfirmed,
		}: {
			id: number
			isConfirmed: boolean | undefined
		}) => {
			try {
				const result = await $api.patch<
					IUpdateChecklistResponse,
					AxiosResponse<IUpdateChecklistResponse>,
					IUpdateChecklistRequest
				>(`${ChecklistEndpoints.BASE}${ChecklistEndpoints.UPDATE}`, {
					checklistId: id,
					creatorId: +userId!,
					isConfirmed,
				})
				return result.data
			} catch (e) {
				if (axios.isAxiosError(e)) throw e?.response?.data
				throw e
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['checklists'],
			})
		},
	})

	const { mutateAsync: updateStorage } = useMutation({
		mutationFn: async ({
			newChecklistData,
		}: {
			newChecklistData: {
				productId: number
				quantity: number
				expires: Date | undefined
				price: number
				currency: keyof typeof Currencies
			}[]
		}) => {
			try {
				const store = await $api.get<
					IGetStoreByUserIdResponse,
					AxiosResponse<IGetStoreByUserIdResponse>
				>(`${StoreEndpoints.BASE}${StoreEndpoints.GET_BY_ID}`, {
					params: {
						creatorId: +userId!,
					},
				})
				const result = await $api.patch<
					IUpdateStoreResponse,
					AxiosResponse<IUpdateStoreResponse>,
					IUpdateStoreRequest
				>(`${StoreEndpoints.BASE}${StoreEndpoints.UPDATE}`, {
					id: store.data.id || -1,
					creatorId: +userId!,
					storeComposition: newChecklistData,
				})
				return result.data
			} catch (e) {
				if (axios.isAxiosError(e)) throw e?.response?.data
				throw e
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['store'],
			})
		},
	})

	if (isLoading) return <h2>Loading...</h2>
	if (error) return <p>Error</p>

	return (
		<>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					height: '40px',
				}}></div>
			<div className={styles.container}>
				<div className={styles.cardsContainer}>
					{data?.checklistsData.map(item => {
						return (
							<div className={styles.card} key={item.id}>
								<div>
									Дата создания: {new Date(item.createdAt).toLocaleString()}
								</div>
								<div>Покупка подтверждена: {item.isConfirmed ? 'да' : 'нет'}</div>
								<button onClick={() => navigate(`/user/checklists/${item.id}`)}>
									Посмотреть
								</button>
								<button
									onClick={async () => {
										const { checklistComposition, isConfirmed } =
											await updateChecklist({
												id: item.id,
												isConfirmed: !item.isConfirmed,
											})

										if (isConfirmed && storeData) {
											const newProductsData = checklistComposition.map<{
												productId: number
												quantity: number
												expires: Date | undefined
												price: number
												currency: keyof typeof Currencies
											}>(product => {
												const productInStore =
													storeData.storeComposition.find(
														item => item.product?.id === product.productId
													)
												if (productInStore)
													return {
														quantity:
															productInStore.quantity + product.quantity,
														expires: undefined,
														productId: product.productId,
														price: product.price,
														currency: product.currency,
													}
												return {
													quantity: product.quantity,
													expires: undefined,
													productId: product.productId,
													price: product.price,
													currency: product.currency,
												}
											})

											const newStorageData = [
												...newProductsData,
												...storeData.storeComposition
													.filter(
														item =>
															!newProductsData.some(
																s => s.productId === item.product?.id
															)
													)
													.map(product => ({
														quantity: product.quantity,
														expires: product.expires || undefined,
														productId: product.product?.id || 1,
														price: product.price,
														currency: product.currency,
													})),
											]
											await updateStorage({
												newChecklistData: newStorageData,
											})
										}
									}}>
									{item.isConfirmed
										? 'Открыть чек заново'
										: 'Подтвердить покупку'}
								</button>
							</div>
						)
					})}
				</div>
			</div>
		</>
	)
}
