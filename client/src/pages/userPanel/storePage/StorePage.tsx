import { useMutation } from '@tanstack/react-query'
import { IErrorResponse } from '../../../api/errorResponse.ts'
import $api from '../../../query/axios/base.ts'
import axios, { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import styles from './storePage.module.scss'
import StoreEndpoints from '../../../api/stores/endpoints.ts'
import { Currencies } from '../../../api/enums.ts'
import queryClient from '../../../query/queryClient.ts'
import {
	IUpdateStoreRequest,
	IUpdateStoreResponse,
} from '../../../api/stores/dto/updateStore.ts'
import useVirtualStore from '../../../storage'
import { useGetAllProducts } from '../../../query/adminPanel/useGetAllProducts.ts'
import { useGetStore } from '../../../query/userPanel/useGetStore.ts'
import { ProductData } from '../../../api/products/common.ts'
import { SearchInput } from '../../../components/searchInput/SearchInput.tsx'
import { toast, ToastContainer } from 'react-toastify'

export const UserStorePage = () => {
	const { userId } = useVirtualStore()

	const [search, setSearch] = useState('')
	const [searchProduct, setSearchProduct] = useState('')

	const { data, error, isLoading } = useGetStore(userId)

	const [selectedProduct, setSelectedProduct] = useState<{
		title?: string
		productId?: number
		expires?: Date | undefined
		quantity?: number
	} | null>(null)

	const { data: productsData, refetch } = useGetAllProducts(searchProduct)

	const [productsModal, setProductsModal] = useState(
		[] as {
			product: ProductData
			title: string
			quantity: number
		}[]
	)

	const {
		mutateAsync: updateStorage,
		error: updateStoreError,
		isError: isUpdateError,
	} = useMutation<IUpdateStoreResponse | void, IErrorResponse>({
		mutationFn: async () => {
			try {
				if (!data) return
				const storageComposition = data?.storeComposition.map<{
					productId: number
					quantity: number
					expires: Date | undefined
					price: number
					currency: keyof typeof Currencies
				}>(item => ({
					productId: item.product?.id || 1,
					quantity: item.quantity,
					expires: item.expires || undefined,
					price: item.price,
					currency: item.currency,
				}))

				const productsFromModal = productsModal.map<{
					productId: number
					quantity: number
					expires: Date | undefined
					price: number
					currency: keyof typeof Currencies
				}>(value => ({
					price: 0,
					currency: Currencies.BYN,
					expires: undefined,
					quantity: value.quantity,
					productId: value.product.id,
				}))

				const result = await $api.patch<
					IUpdateStoreResponse,
					AxiosResponse<IUpdateStoreResponse>,
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
										quantity: selectedProduct.quantity || 0,
										expires: selectedProduct.expires
											? new Date(selectedProduct.expires)
											: undefined,
										price: 0,
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

	const {
		mutateAsync: dropProductFromStorage,
		error: dropProductError,
		isError: isDropError,
	} = useMutation<IUpdateStoreResponse | void, IErrorResponse, number | undefined>({
		mutationFn: async id => {
			try {
				if (!id) return
				const storageComposition = data?.storeComposition.map<{
					productId: number
					quantity: number
					expires: Date | undefined
					price: number
					currency: keyof typeof Currencies
				}>(item => ({
					productId: item.product?.id || 1,
					quantity: item.quantity,
					expires: item.expires ?? undefined,
					price: item.price,
					currency: item.currency,
				}))

				const result = await $api.patch<
					IUpdateStoreResponse,
					AxiosResponse<IUpdateStoreResponse>,
					IUpdateStoreRequest
				>(`${StoreEndpoints.BASE}${StoreEndpoints.UPDATE}`, {
					id: data?.id || 1,
					creatorId: data?.creatorId || 1,
					storeComposition:
						storageComposition?.filter(item => item?.productId !== id) || [],
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

	useEffect(() => {
		if (isUpdateError)
			toast(updateStoreError?.field ?? '' + ' ' + updateStoreError?.message, {
				type: 'error',
				theme: 'dark',
			})
		if (isDropError)
			toast(dropProductError?.field ?? '' + ' ' + dropProductError?.message, {
				type: 'error',
				theme: 'dark',
			})
	}, [isUpdateError, isDropError])

	useEffect(() => {
		refetch().finally()
	}, [refetch, searchProduct])

	if (isLoading) return <h2>Loading...</h2>
	if (error) return <p>Error</p>

	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
				<SearchInput search={search} onChange={e => setSearch(e.target.value)} />
			</div>
			<div className={styles.container}>
				<div className={styles.modal}>
					{selectedProduct ? (
						<>
							<p>Редактирование продукта</p>
							<div>
								<p>Продукт: {selectedProduct.title}</p>
							</div>
							<div className={styles.div}>
								<p>Годен до:</p>
								<input
									type='date'
									onChange={e =>
										setSelectedProduct(prev => ({
											...prev,
											expires: new Date(e.target.value),
										}))
									}
								/>
							</div>
							<div className={styles.div}>
								<p>Количество:</p>
								<input
									type='number'
									step={1}
									onChange={e =>
										setSelectedProduct(prev => ({
											...prev,
											quantity: +e.target.value,
										}))
									}
									value={selectedProduct.quantity}
								/>
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
																	item => item.product.id === product.id
																)
															)
																return prev
															return [
																...prev,
																{
																	product: product,
																	// units: Units.GRAMS,
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
											key={item.product.id}
											style={{
												display: 'flex',
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'space-around',
												gap: '5%',
											}}>
											<p>{item.title}</p>
											<input
												type='number'
												value={item.quantity}
												step={1}
												min={0}
												max={30000}
												onChange={e =>
													setProductsModal(prev =>
														prev.map(product => {
															if (product.product.id !== item.product.id)
																return product
															return {
																...product,
																quantity: +e.target.value,
															}
														})
													)
												}
											/>
											<div
												onClick={() =>
													setProductsModal(prev =>
														prev.filter(
															product =>
																product.product.id !== item.product.id
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
											<div>
												{' '}
												Кол-во: {item.quantity} {item.product?.units}
											</div>
										</div>
										<div>
											<p>Ккал: {item.product?.calories}</p>
											<p>Б: {item.product?.protein}</p>
											<p>Ж: {item.product?.fats}</p>
											<p>У: {item.product?.carbohydrates}</p>
										</div>
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
													expires: item.expires || undefined,
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
				<ToastContainer />
			</div>
		</>
	)
}
