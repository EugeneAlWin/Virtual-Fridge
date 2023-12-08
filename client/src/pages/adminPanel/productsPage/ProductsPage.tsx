import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import $api from '../../../query/axios/base.ts'
import ProductEndpoints from '../../../api/products/endpoints.ts'
import { IGetAllProductsResponse } from '../../../api/products/dto/getAllProducts.ts'
import axios, { AxiosError, AxiosResponse } from 'axios'
import styles from './productPage.module.scss'
import { useState } from 'react'
import { IDeleteProductsResponse } from '../../../api/products/dto/deleteProduct.ts'
import queryClient from '../../../query/queryClient.ts'
import {
	ICreateProductRequest,
	ICreateProductResponse,
} from '../../../api/products/dto/createProduct.ts'
import {
	IUpdateProductRequest,
	IUpdateProductResponse,
} from '../../../api/products/dto/updateProduct.ts'
import { IErrorResponse } from '../../../api/errorResponse.ts'
import useVirtualStore from '../../../storage'

export const ProductsPage = () => {
	const { userId } = useVirtualStore()

	const [selectedProduct, setSelectedProduct] = useState<null | IUpdateProductRequest>(
		null
	)

	const newProductInitState: ICreateProductRequest = {
		creatorId: 0,
		title: '',
		carbohydrates: 0,
		calories: 0,
		fats: 0,
		protein: 0,
	}
	const [newProduct, setNewProduct] =
		useState<ICreateProductRequest>(newProductInitState)

	const { data, hasNextPage, fetchNextPage } = useInfiniteQuery<
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
			if (lastPage.productsData.length < 25) return
			return {
				cursor: lastPage?.cursor ? lastPage.cursor + 1 : null,
				pageSize: 25,
			}
		},
		retry: false,
	})
	const [search, setSearch] = useState('')

	const { mutateAsync: dropProduct } = useMutation({
		mutationFn: async (id: number) => {
			try {
				const result = await $api.delete<IDeleteProductsResponse>(
					`${ProductEndpoints.BASE}${ProductEndpoints.DELETE_PRODUCT}`,
					{
						data: {
							productsId: [id],
						},
					}
				)
				return result.data.count
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

	const { mutateAsync: createProduct } = useMutation({
		mutationFn: async () => {
			try {
				const result = await $api.post<
					AxiosError<IErrorResponse>,
					AxiosResponse<ICreateProductResponse>,
					ICreateProductRequest
				>(`${ProductEndpoints.BASE}${ProductEndpoints.CREATE_PRODUCT}`, {
					calories: newProduct.calories,
					fats: newProduct.fats,
					carbohydrates: newProduct.carbohydrates,
					protein: newProduct.protein,
					title: newProduct.title,
					creatorId: +userId!,
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
		},
	})

	const { mutateAsync: updateProduct } = useMutation({
		mutationFn: async () => {
			try {
				if (!selectedProduct) return
				const result = await $api.patch<
					IErrorResponse,
					AxiosResponse<IUpdateProductResponse>,
					IUpdateProductRequest
				>(`${ProductEndpoints.BASE}${ProductEndpoints.UPDATE_PRODUCT}`, {
					calories: selectedProduct?.calories,
					fats: selectedProduct?.fats,
					carbohydrates: selectedProduct?.carbohydrates,
					protein: selectedProduct?.protein,
					title: selectedProduct?.title,
					id: selectedProduct.id,
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
		},
	})
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
								<p>Название</p>
								<input
									type='text'
									value={selectedProduct.title}
									onChange={e =>
										setSelectedProduct(prev => ({
											...prev,
											title: e.target.value,
										}))
									}
								/>
							</div>
							<div>
								<p>Белки</p>
								<input
									type='number'
									step={0.01}
									value={selectedProduct.protein}
									onChange={e =>
										setSelectedProduct(prev => ({
											...prev,
											protein: e.target.value,
										}))
									}
								/>
							</div>
							<div>
								<p>Жиры</p>
								<input
									type='number'
									step={0.01}
									value={selectedProduct.fats}
									onChange={e =>
										setSelectedProduct(prev => ({
											...prev,
											fats: e.target.value,
										}))
									}
								/>
							</div>
							<div>
								<p>Углеводы</p>
								<input
									type='number'
									step={0.01}
									value={selectedProduct.carbohydrates}
									onChange={e =>
										setSelectedProduct(prev => ({
											...prev,
											carbohydrates: e.target.value,
										}))
									}
								/>
							</div>
							<div>
								<p>Ккал</p>
								<input
									type='number'
									step={1}
									value={selectedProduct.calories}
									onChange={e =>
										setSelectedProduct(prev => ({
											...prev,
											calories: e.target.value,
										}))
									}
								/>
							</div>
							<div>
								<button
									onClick={async () => {
										await updateProduct()
										setSelectedProduct(null)
									}}>
									Сохранить
								</button>
								<button onClick={() => setSelectedProduct(null)}>Отменить</button>
							</div>
						</>
					) : (
						<>
							<p>Создание продукта</p>
							<div>
								<p>Название</p>
								<input
									type='text'
									value={newProduct.title}
									onChange={e =>
										setNewProduct(prev => ({
											...prev,
											title: e.target.value,
										}))
									}
								/>
							</div>
							<div>
								<p>Белки</p>
								<input
									type='number'
									step={0.01}
									value={newProduct.protein}
									onChange={e =>
										setNewProduct(prev => ({
											...prev,
											protein: e.target.value,
										}))
									}
								/>
							</div>
							<div>
								<p>Жиры</p>
								<input
									type='number'
									step={0.01}
									value={newProduct.fats}
									onChange={e =>
										setNewProduct(prev => ({
											...prev,
											fats: e.target.value,
										}))
									}
								/>
							</div>
							<div>
								<p>Углеводы</p>
								<input
									type='number'
									step={0.01}
									value={newProduct.carbohydrates}
									onChange={e =>
										setNewProduct(prev => ({
											...prev,
											carbohydrates: e.target.value,
										}))
									}
								/>
							</div>
							<div>
								<p>Ккал</p>
								<input
									type='number'
									step={0.01}
									value={newProduct.calories}
									onChange={e =>
										setNewProduct(prev => ({
											...prev,
											calories: e.target.value,
										}))
									}
								/>
							</div>
							<div>
								<button onClick={async () => await createProduct()}>
									Сохранить
								</button>
								<button onClick={() => setNewProduct(newProductInitState)}>
									Отменить
								</button>
							</div>
						</>
					)}
				</div>
				<div className={styles.cardsContainer}>
					{data?.pages.map(page =>
						page.productsData
							.filter(item =>
								item.title.toLowerCase().includes(search.toLowerCase())
							)
							.map(item => (
								<div className={styles.card} key={item.id}>
									<p>{item.title}</p>
									<div>
										<div>
											<p>Ккал: {item.calories}</p>
											<p>Б: {item.protein}</p>
											<p>Ж: {item.fats}</p>
											<p>У: {item.carbohydrates}</p>
										</div>
										<div className={styles.cardEditBar}>
											<button
												onClick={() =>
													setSelectedProduct({
														calories: item.calories,
														carbohydrates: item.carbohydrates,
														fats: item.fats,
														id: item.id,
														protein: item.protein,
														title: item.title,
													})
												}>
												Edit
											</button>
											<button
												className={styles.redButton}
												onClick={async () => await dropProduct(item.id)}>
												Удалить навсегда
											</button>
										</div>
									</div>
								</div>
							))
					)}
					{hasNextPage && <button onClick={() => fetchNextPage()}>Ещё</button>}
				</div>
			</div>
		</>
	)
}
