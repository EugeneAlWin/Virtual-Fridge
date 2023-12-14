import { useMutation, useQuery } from '@tanstack/react-query'
import { IErrorResponse } from '../../../api/errorResponse.ts'
import $api from '../../../query/axios/base.ts'
import axios, { AxiosResponse } from 'axios'
import { useState } from 'react'
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
	StoreCompositionData,
} from '../../../api/stores/dto/updateStore.ts'
import useVirtualStore from '../../../storage'

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

	const {
		data: storeData,
		error: storeError,
		isLoading: isStoreDataLoading,
	} = useQuery<
		IGetStoreByUserIdResponse,
		IErrorResponse,
		IGetStoreByUserIdResponse,
		['store']
	>({
		queryKey: ['store'],
		queryFn: async () => {
			try {
				const result = await $api.get<
					AxiosResponse<IErrorResponse>,
					AxiosResponse<IGetStoreByUserIdResponse>
				>(`${StoreEndpoints.BASE}${StoreEndpoints.GET_BY_ID}`, {
					params: {
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

	const { mutateAsync: updateChecklist } = useMutation({
		mutationFn: async ({
			id,
			isConfirmed,
			checklistComposition,
			checklistPrices,
		}: {
			id: number
			isConfirmed: boolean | undefined
			checklistComposition: undefined
			checklistPrices: undefined
		}) => {
			try {
				const result = await $api.patch<
					IErrorResponse,
					AxiosResponse<IUpdateChecklistResponse>,
					IUpdateChecklistRequest
				>(`${ChecklistEndpoints.BASE}${ChecklistEndpoints.UPDATE}`, {
					checklistId: id,
					creatorId: +userId!,
					isConfirmed,
					checklistComposition,
					checklistPrices,
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
			newChecklistData: StoreCompositionData[]
		}) => {
			try {
				const store = await $api.get<
					AxiosResponse<IErrorResponse>,
					AxiosResponse<IGetStoreByUserIdResponse>
				>(`${StoreEndpoints.BASE}${StoreEndpoints.GET_BY_ID}`, {
					params: {
						creatorId: +userId!,
					},
				})
				const result = await $api.patch<
					IUpdateStoreResponse | IErrorResponse,
					AxiosResponse<IUpdateStoreResponse | IErrorResponse>,
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

	const [search, setSearch] = useState('')
	if (isLoading) return <h2>Loading...</h2>
	if (error) return <p>Error</p>

	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
				<div>
					<p>Искать</p>
					<input
						type='text'
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
				</div>
			</div>
			<div className={styles.container}>
				<div className={styles.cardsContainer}>
					{data?.checklistsData.map(item => {
						return (
							<div className={styles.card} key={item.id}>
								<div>
									Дата создания: {new Date(item.createdAt).toLocaleString()}
								</div>
								<div>Покупка подтверждена: {item.isConfirmed ? 'да' : 'нет'}</div>
								{/*<p>Цены:</p>*/}
								{/*<div style={{ display: 'flex', justifyContent: 'space-evenly' }}>*/}
								{/*	<div>Буны</div>*/}
								{/*	<div>{item.checklistPrices.BYN}</div>*/}
								{/*</div>*/}
								{/*<div style={{ display: 'flex', justifyContent: 'space-evenly' }}>*/}
								{/*	<div>Валюта</div>*/}
								{/*	<div>{item.checklistPrices.USD}</div>*/}
								{/*</div>*/}
								{/*<div style={{ display: 'flex', justifyContent: 'space-evenly' }}>*/}
								{/*	<div>Рубли</div>*/}
								{/*	<div>{item.checklistPrices.RUB}</div>*/}
								{/*</div>*/}
								<button onClick={() => navigate(`/user/checklists/${item.id}`)}>
									Посмотреть
								</button>
								<button
									onClick={async () => {
										const {
											checklistComposition,
											isConfirmed,
											checklistPrices,
										} = await updateChecklist({
											id: item.id,
											isConfirmed: !item.isConfirmed,
										})

										if (isConfirmed && storeData) {
											const newProductsData =
												checklistComposition.map<StoreCompositionData>(
													product => {
														const productInStore =
															storeData.storeComposition.find(
																item =>
																	item.product?.id === product.productId
															)
														if (productInStore)
															return {
																quantity:
																	productInStore.quantity +
																	product.quantity,
																expires: null,
																productId: product.productId,
																price: product.price,
																currency: product.currency,
															}
														return {
															quantity: product.quantity,
															expires: null,
															productId: product.productId,
															price: product.price,
															currency: product.currency,
														}
													}
												)

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
														expires: product.expires,
														productId: product.product?.id,
														price: product.price,
														currency: product.currency,
													})),
											]
											console.log(newStorageData)
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
