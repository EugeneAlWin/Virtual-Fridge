import { useMutation, useQuery } from '@tanstack/react-query'
import { IErrorResponse } from '../../../api/errorResponse.ts'
import $api from '../../../query/axios/base.ts'
import axios, { AxiosResponse, isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import styles from './checklistPage.module.scss'
import { Currencies, Units } from '../../../api/enums.ts'
import {
	IGetChecklistByIdRequest,
	IGetChecklistByIdResponse,
} from '../../../api/checklists/dto/getChecklistById.ts'
import ChecklistEndpoints from '../../../api/checklists/endpoints.ts'
import { useParams } from 'react-router-dom'
import queryClient from '../../../query/queryClient.ts'
import {
	IUpdateChecklistRequest,
	IUpdateChecklistResponse,
} from '../../../api/checklists/dto/updateChecklist.ts'
import useVirtualStore from '../../../storage'
import { useGetAllProducts } from '../../../query/adminPanel/useGetAllProducts.ts'
import { SearchInput } from '../../../components/searchInput/SearchInput.tsx'
import { toast, ToastContainer } from 'react-toastify'

export const UserChecklistPage = () => {
	const { userId } = useVirtualStore()

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
					IGetChecklistByIdResponse,
					AxiosResponse<IGetChecklistByIdResponse>
				>(`${ChecklistEndpoints.BASE}${ChecklistEndpoints.GET_BY_ID}`, {
					params: {
						id: checklistId,
					},
				})

				setProductsModal(
					result.data.checklistComposition.map(item => ({
						productId: item?.product?.id || 1,
						title: item.product?.title || '',
						quantity: item.quantity,
						units: (item.product?.units as Units) || Units.GRAMS,
					}))
				)
				return result.data
			} catch (e) {
				if (isAxiosError(e)) return e?.response?.data
				return e
			}
		},
		refetchOnWindowFocus: false,
		retry: false,
	})

	const [search, setSearch] = useState('')

	const [searchProduct, setSearchProduct] = useState('')
	const { data: productsData } = useGetAllProducts(searchProduct)

	const [productsModal, setProductsModal] = useState(
		[] as {
			productId: number
			title: string
			quantity: number
			units: Units
		}[]
	)

	const {
		mutateAsync: updateChecklist,
		isError,
		isSuccess,
		error: updateError,
	} = useMutation<IUpdateChecklistResponse | void, IErrorResponse>({
		mutationFn: async () => {
			try {
				const productsFromModal: {
					productId: number
					quantity: number
					expires: Date | undefined
					price: number
					currency: keyof typeof Currencies
				}[] = productsModal.map(value => ({
					price: 0,
					currency: Currencies.BYN,
					unit: value.units,
					expires: undefined,
					quantity: value.quantity,
					productId: value.productId,
				}))
				const result = await $api.patch<
					IUpdateChecklistResponse,
					AxiosResponse<IUpdateChecklistResponse>,
					IUpdateChecklistRequest
				>(`${ChecklistEndpoints.BASE}${ChecklistEndpoints.UPDATE}`, {
					checklistId: data?.id || -1,
					creatorId: +userId!, //TODO: fix id
					checklistComposition: productsFromModal.map(product => ({
						currency: product.currency,
						price: product.price,
						productId: product.productId,
						quantity: product.quantity,
					})),
					checklistPrices: data?.checklistPrices,
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

	useEffect(() => {
		if (isError)
			toast(updateError?.field + ' ' + updateError?.message, {
				type: 'error',
				theme: 'dark',
			})
		if (isSuccess) toast('Хранилище обновлено!', { type: 'success' })
	}, [updateError?.field, updateError?.message, isError, isSuccess])

	if (isLoading) return <h2>Loading...</h2>
	if (error) return <p>Error</p>
	if (!data) return <p>Данных нету</p>
	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
				<SearchInput search={search} onChange={e => setSearch(e.target.value)} />
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
											alignItems: 'center',
											gap: '5%',
										}}>
										<p>{item.title}</p>
										<input
											type='number'
											value={item.quantity}
											step={1}
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
										<p>{item.units}</p>
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
					{data?.checklistComposition
						.filter(
							item =>
								item.product?.title.toLowerCase().includes(search.toLowerCase())
						)
						.map(item => (
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
									</div>
								</div>
							</div>
						))}
				</div>
			</div>
			<ToastContainer />
		</>
	)
}
