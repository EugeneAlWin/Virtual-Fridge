import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import { IErrorResponse } from '../../../api/errorResponse.ts'
import $api from '../../../query/axios/base.ts'
import axios, { AxiosResponse } from 'axios'
import { useState } from 'react'
import styles from './checklistPage.module.scss'
import { Currencies, Units } from '../../../api/enums.ts'
import ProductEndpoints from '../../../api/products/endpoints.ts'
import { IGetAllProductsResponse } from '../../../api/products/dto/getAllProducts.ts'
import {
	IGetChecklistByIdRequest,
	IGetChecklistByIdResponse,
} from '../../../api/checklists/dto/getChecklistById.ts'
import ChecklistEndpoints from '../../../api/checklists/endpoints.ts'
import { useParams } from 'react-router-dom'
import { StoreCompositionData } from '../../../api/stores/dto/updateStore.ts'
import queryClient from '../../../query/queryClient.ts'
import {
	IUpdateChecklistRequest,
	IUpdateChecklistResponse,
} from '../../../api/checklists/dto/updateChecklist.ts'

export const UserChecklistPage = () => {
	const { checklistId } = useParams()
	const { data, error, isLoading } = useQuery<
		IGetChecklistByIdRequest,
		IErrorResponse,
		IGetChecklistByIdResponse,
		['checklist']
	>({
		queryKey: ['checklist'],
		queryFn: async () => {
			try {
				const result = await $api.get<
					AxiosResponse<IErrorResponse>,
					AxiosResponse<IGetChecklistByIdResponse>
				>(`${ChecklistEndpoints.BASE}${ChecklistEndpoints.GET_BY_ID}`, {
					params: {
						id: checklistId,
					},
				})

				setProductsModal(
					result.data.checklistComposition.map(item => ({
						productId: item.product.id,
						title: item.product?.title,
						quantity: item.quantity,
						units: item.units,
					}))
				)
				return result.data
			} catch (e) {
				if (axios.isAxiosError(e)) throw e?.response?.data
				throw e
			}
		},
		refetchOnWindowFocus: false,
		retry: false,
	})

	const [search, setSearch] = useState('')

	const [searchProduct, setSearchProduct] = useState('')
	const { data: productsData } = useInfiniteQuery<
		IGetAllProductsResponse,
		IErrorResponse
	>({
		queryKey: ['products'],
		queryFn: async ({ pageParam }) => {
			try {
				const result = await $api.get<
					AxiosResponse<IErrorResponse>,
					AxiosResponse<IGetAllProductsResponse>
				>(`${ProductEndpoints.BASE}${ProductEndpoints.GET_ALL_PRODUCTS}`, {
					params: {
						skip: 0,
						take: pageParam?.pageSize || 25,
						cursor: pageParam?.cursor,
						title: searchProduct,
					},
				})
				return {
					productsData: result.data?.productsData,
					cursor: result.data?.cursor,
				}
			} catch (e) {
				if (axios.isAxiosError(e)) throw e?.response?.data
				throw e
			}
		},
		refetchOnWindowFocus: false,
		initialPageParam: { pageSize: 25, cursor: null },
		getNextPageParam: lastPage => {
			if (lastPage?.productsData?.length < 25) return
			return {
				cursor: lastPage?.cursor ? lastPage.cursor + 1 : null,
				pageSize: 25,
			}
		},
		enabled: !!searchProduct,
	})

	const [productsModal, setProductsModal] = useState(
		[] as {
			productId: number
			title: string
			quantity: number
			units: Units
		}[]
	)

	const { mutateAsync: updateChecklist } = useMutation({
		mutationFn: async () => {
			try {
				if (!data) return
				const productsFromModal: StoreCompositionData[] = productsModal.map(
					value => ({
						price: '0',
						currency: Currencies.BYN,
						unit: value.units,
						expires: undefined,
						quantity: value.quantity,
						productId: value.productId,
					})
				)
				const result = await $api.patch<
					IUpdateChecklistResponse | IErrorResponse,
					AxiosResponse<IUpdateChecklistResponse | IErrorResponse>,
					IUpdateChecklistRequest
				>(`${ChecklistEndpoints.BASE}${ChecklistEndpoints.UPDATE}`, {
					checklistId: data.id || -1,
					creatorId: 43, //TODO: fix id
					checklistComposition: productsFromModal.map(product => ({
						currency: product.currency,
						price: product.price,
						productId: product.productId,
						quantity: product.quantity,
						units: product.unit,
					})),
					checklistPrices: data.checklistPrices,
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

	if (isLoading) return <h2>Loading...</h2>
	if (error) return <p>Error</p>
	if (!data) return <p>Данных нету</p>
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
				<div className={styles.modal}>
					<>
						<p>Добавление продукта</p>
						<div>
							<input
								type='text'
								value={searchProduct}
								onChange={e => setSearchProduct(e.target.value)}
							/>
							{searchProduct && (
								<div className={styles.productListContainer}>
									{productsData?.pages.map(page =>
										page.productsData.map(product => (
											<div
												key={product.id}
												onClick={() => {
													setProductsModal(prev => {
														if (
															prev.find(
																item => item.productId === product.id
															)
														)
															return prev
														return [
															...prev,
															{
																productId: product.id,
																units: Units.GRAMS,
																quantity: 0,
																title: product.title,
															},
														]
													})
												}}>
												{product.title}
											</div>
										))
									)}
								</div>
							)}
							<div>
								<p>Состав рецепта:</p>
								<div
									style={{
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'space-around',
									}}>
									<p>Название | </p>
									<p>Кол-во | </p>
									<p>Размерность</p>
								</div>
								{productsModal.map(item => (
									<div
										key={item.productId}
										style={{
											display: 'flex',
											flexDirection: 'row',
											justifyContent: 'space-around',
										}}>
										<p>{item.title}</p>
										<input
											type='number'
											value={item.quantity}
											step={0.01}
											onChange={e =>
												setProductsModal(prev =>
													prev.map(product => {
														if (product.productId !== item.productId)
															return product
														return {
															...product,
															quantity: +e.target.value,
														}
													})
												)
											}
										/>
										<select
											name='units'
											value={item.units}
											onChange={e =>
												setProductsModal(prev =>
													prev.map(product => {
														if (product.productId !== item.productId)
															return product
														return {
															...product,
															units: e.target.value as Units,
														}
													})
												)
											}>
											{Object.values(Units).map(val => (
												<option value={val}>{val}</option>
											))}
										</select>
										<div
											onClick={() =>
												setProductsModal(prev =>
													prev.filter(
														product => product.productId !== item.productId
													)
												)
											}>
											X
										</div>
									</div>
								))}
							</div>
						</div>
						<div>
							<button
								onClick={async () => {
									await updateChecklist()
								}}>
								Синхронизировать
							</button>
							<button onClick={() => setProductsModal([])}>Очистить</button>
						</div>
					</>
				</div>
				<div className={styles.cardsContainer}>
					{data?.checklistComposition.map(item => (
						<div className={styles.card} key={item.product?.id}>
							<p>{item.product?.title}</p>
							<div>
								<div>
									<p>Ккал: {item.product?.calories}</p>
									<p>Б: {item.product?.protein}</p>
									<p>Ж: {item.product?.fats}</p>
									<p>У: {item.product?.carbohydrates}</p>
								</div>
								<div>
									<p>Количество: {item.quantity}</p>
									<p>Единицы: {item.units}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	)
}
