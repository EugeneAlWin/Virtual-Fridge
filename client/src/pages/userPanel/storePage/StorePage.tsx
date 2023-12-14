import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import { IErrorResponse } from '../../../api/errorResponse.ts'
import $api from '../../../query/axios/base.ts'
import axios, { AxiosResponse } from 'axios'
import { useState } from 'react'
import styles from './storePage.module.scss'
import { IGetStoreByUserIdResponse } from '../../../api/stores/dto/getStoreByUserId.ts'
import StoreEndpoints from '../../../api/stores/endpoints.ts'
import { Currencies, Units } from '../../../api/enums.ts'
import queryClient from '../../../query/queryClient.ts'
import {
	IUpdateStoreRequest,
	IUpdateStoreResponse,
	StoreCompositionData,
} from '../../../api/stores/dto/updateStore.ts'
import ProductEndpoints from '../../../api/products/endpoints.ts'
import { IGetAllProductsResponse } from '../../../api/products/dto/getAllProducts.ts'
import useVirtualStore from '../../../storage'

export const UserStorePage = () => {
	const { userId } = useVirtualStore()

	const { data, error, isLoading } = useQuery<
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
		refetchOnWindowFocus: true,
		retry: false,
	})
	const [selectedProduct, setSelectedProduct] = useState<{
		title: string
		productId: number
		expires: Date | null
		quantity: number
		units: keyof typeof Units
	} | null>(null)
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
		refetchOnWindowFocus: true,
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

	const { mutateAsync: updateStorage } = useMutation({
		mutationFn: async () => {
			try {
				if (!data) return
				const storageComposition: StoreCompositionData[] =
					data?.storeComposition.map<StoreCompositionData>(item => ({
						productId: item.product?.id || 1,
						quantity: item.quantity,
						expires: item.expires || undefined,
						price: item.price.toString(),
						currency: item.currency,
					}))

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
					IUpdateStoreResponse | IErrorResponse,
					AxiosResponse<IUpdateStoreResponse | IErrorResponse>,
					IUpdateStoreRequest
				>(`${StoreEndpoints.BASE}${StoreEndpoints.UPDATE}`, {
					id: data.id,
					creatorId: +userId!,
					storeComposition: [
						...storageComposition.filter(
							item => item.productId !== selectedProduct?.productId
						),
						...(selectedProduct
							? [
									{
										productId: selectedProduct.productId || 1,
										quantity: selectedProduct.quantity,
										expires: selectedProduct.expires
											? new Date(selectedProduct.expires)
											: undefined,
										price: '0.0',
										currency: Currencies.BYN,
									},
							  ]
							: [...productsFromModal]),
					],
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

	const { mutateAsync: dropProductFromStorage } = useMutation({
		mutationFn: async (id: number) => {
			try {
				const storageComposition: StoreCompositionData[] =
					data?.storeComposition.map<StoreCompositionData>(item => ({
						productId: item.product?.id || 1,
						quantity: item.quantity,
						expires: item.expires ?? undefined,
						unit: item.unit,
						price: item.price.toString(),
						currency: item.currency,
					}))

				const result = await $api.patch<
					IUpdateStoreResponse | IErrorResponse,
					AxiosResponse<IUpdateStoreResponse | IErrorResponse>,
					IUpdateStoreRequest
				>(`${StoreEndpoints.BASE}${StoreEndpoints.UPDATE}`, {
					id: data?.id,
					creatorId: data?.creatorId,
					storeComposition: storageComposition.filter(item => item.productId !== id),
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
					{selectedProduct ? (
						<>
							<p>Редактирование продукта</p>
							<div>
								<p>Продукт: {selectedProduct.title}</p>
							</div>
							<div>
								<p>Срок годности до:</p>
								<input
									type='date'
									onChange={e =>
										setSelectedProduct(prev => ({
											...prev,
											expires: e.target.value,
										}))
									}
								/>
							</div>
							<div>
								<p>Количество:</p>
								<input
									type='number'
									step={1}
									onChange={e =>
										setSelectedProduct(prev => ({
											...prev,
											quantity: e.target.value,
										}))
									}
									value={selectedProduct.quantity}
								/>
							</div>
							<div>
								<p>Единицы:</p>
								<select
									name='productSelect'
									id='productSelect'
									value={selectedProduct.units}
									onChange={e =>
										setSelectedProduct(prev => ({
											...prev,
											units: e.target.value,
										}))
									}>
									{Object.values(Units).map(unit => (
										<option value={unit}>{unit}</option>
									))}
								</select>
							</div>
							<div>
								<button
									onClick={async () => {
										await updateStorage()
										setSelectedProduct(null)
									}}>
									Сохранить
								</button>

								<button onClick={() => setSelectedProduct(null)}>Отменить</button>
							</div>
						</>
					) : (
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
															product =>
																product.productId !== item.productId
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
									disabled={productsModal.length === 0}
									onClick={async () => {
										await updateStorage()
									}}>
									Сохранить
								</button>
								<button onClick={() => setProductsModal([])}>Отменить</button>
							</div>
						</>
					)}
				</div>
				<div className={styles.cardsContainer}>
					{data?.storeComposition.length === 0 ? (
						<p style={{ color: 'red' }}>Ничего нет</p>
					) : (
						data?.storeComposition
							.filter(
								item =>
									item.product?.title
										.toLowerCase()
										.includes(search.toLowerCase())
							)
							.map(item => {
								return (
									<div className={styles.card} key={item.product?.id}>
										<div>{item.product?.title}</div>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-evenly',
											}}>
											<div> Кол-во: {item.quantity}</div>
											<div>Единицы: {item.unit}</div>
										</div>
										{/*<div*/}
										{/*	style={{*/}
										{/*		display: 'flex',*/}
										{/*		justifyContent: 'space-evenly',*/}
										{/*	}}>*/}
										{/*	<div>{item.price}</div>*/}
										{/*	<div>{item.currency}</div>*/}
										{/*</div>*/}
										<div>
											{item.expires && (
												<p>
													Годен до:{' '}
													{new Date(item.expires).toLocaleDateString()}
												</p>
											)}
										</div>
										<button
											onClick={() => {
												setSelectedProduct({
													productId: item.product?.id,
													quantity: item.quantity,
													expires: item.expires,
													units: item.unit,
													title: item.product?.title,
												})
											}}>
											ред
										</button>
										<button
											onClick={async () => {
												await dropProductFromStorage(item.product?.id)
											}}>
											X
										</button>
									</div>
								)
							})
					)}
				</div>
			</div>
		</>
	)
}
