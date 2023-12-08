import {
	InfiniteData,
	useInfiniteQuery,
	useMutation,
	useQuery,
} from '@tanstack/react-query'
import { IGetAllRecipesResponse } from '../../../api/recipes/dto/getAllRecipes.ts'
import { IErrorResponse } from '../../../api/errorResponse.ts'
import $api from '../../../query/axios/base.ts'
import axios, { AxiosResponse } from 'axios'
import RecipeEndpoints from '../../../api/recipes/endpoints.ts'
import { useState } from 'react'
import styles from './recipesPage.module.scss'
import { Currencies, Units } from '../../../api/enums.ts'
import { IGetStoreByUserIdResponse } from '../../../api/stores/dto/getStoreByUserId.ts'
import StoreEndpoints from '../../../api/stores/endpoints.ts'
import ChecklistEndpoints from '../../../api/checklists/endpoints.ts'
import queryClient from '../../../query/queryClient.ts'
import {
	ICreateChecklistRequest,
	ICreateChecklistResponse,
} from '../../../api/checklists/dto/createChecklist.ts'
import useVirtualStore from '../../../storage'

export const UserRecipesPage = () => {
	const { userId } = useVirtualStore()

	const [selectedRecipes, setSelectedRecipes] = useState<{
		[recipeId: number]: boolean
	}>({})
	const { data, error, isLoading } = useInfiniteQuery<
		IGetAllRecipesResponse,
		IErrorResponse,
		InfiniteData<IGetAllRecipesResponse>,
		['recipes'],
		{
			pageSize: number
			cursor: { recipeId: number; productId: number } | null
		}
	>({
		queryKey: ['recipes'],
		queryFn: async ({ pageParam }) => {
			try {
				const result = await $api.get<
					AxiosResponse<IErrorResponse>,
					AxiosResponse<IGetAllRecipesResponse>
				>(`${RecipeEndpoints.BASE}${RecipeEndpoints.GET_ALL}`, {
					params: {
						skip: 0,
						take: pageParam?.pageSize || 25,
						cursor: pageParam?.cursor,
					},
				})
				return { recipesData: result.data?.recipesData, cursor: result.data?.cursor }
			} catch (e) {
				if (axios.isAxiosError(e)) throw e?.response?.data
				throw e
			}
		},
		refetchOnWindowFocus: false,
		initialPageParam: { pageSize: 25, cursor: null },
		getNextPageParam: lastPage => {
			if (lastPage.recipesData?.length < 25) return
			return {
				cursor: lastPage?.cursor ? lastPage.cursor : null,
				pageSize: 25,
			}
		},
		retry: false,
	})
	const [search, setSearch] = useState('')

	const { data: storeData } = useQuery<
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

	const { mutateAsync: createCheckList } = useMutation({
		mutationFn: async (
			data: {
				productId: number
				quantity: number
				units: keyof typeof Units
				price: string
				currency: keyof typeof Currencies
			}[]
		) => {
			try {
				const result = await $api.post<
					ICreateChecklistResponse | IErrorResponse,
					AxiosResponse<ICreateChecklistResponse | IErrorResponse>,
					ICreateChecklistRequest
				>(`${ChecklistEndpoints.BASE}${ChecklistEndpoints.CREATE}`, {
					creatorId: +userId!,
					checklistComposition: data,
					checklistPrices: {
						BYN: '3',
						RUB: '3',
						USD: '3',
					},
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
				<div>
					<button
						disabled={Object.values(selectedRecipes).every(val => !val)}
						onClick={async () => {
							const recipes = data?.pages
								.map(page => page.recipesData)
								.flat(1)
								.filter(recipe => selectedRecipes[recipe.recipe.id])
							const products = recipes
								?.map(recipe => recipe.recipe.products)
								.flat(1)
							let uniqueProducts: {
								[title: string]: {
									productId: number
									quantity: number
									units: keyof typeof Units
									price: string
									currency: keyof typeof Currencies
								}
							} = {}
							uniqueProducts = products?.reduce((prev, curr) => {
								const quantity = curr?.quantity
								const obj = {
									...curr,
									quantity: prev[curr.title]
										? (prev[curr.title].quantity += quantity)
										: quantity,
									unit: curr?.units,
								}

								return {
									...prev,
									[curr.title]: obj,
								}
							}, uniqueProducts)
							const checklist = Object.keys(uniqueProducts).map<{
								productId: number
								quantity: number
								units: keyof typeof Units
								price: string
								currency: keyof typeof Currencies
							}>(title => {
								const productFromStore = storeData?.storeComposition.find(
									i => i.product?.title === title
								)
								if (productFromStore) {
									return productFromStore.quantity -
										uniqueProducts[title].quantity <
										0
										? {
												currency: 'BYN',
												price: '3',
												productId: uniqueProducts[title]?.id,
												units: uniqueProducts[title]?.units,
												quantity: Math.abs(
													productFromStore.quantity -
														uniqueProducts[title].quantity
												),
										  }
										: null
								}
								return {
									quantity: uniqueProducts[title].quantity,
									currency: 'BYN',
									price: '3',
									productId: uniqueProducts[title]?.id,
									units: uniqueProducts[title]?.units,
								}
							})
							if (checklist.every(item => !item))
								return alert(
									'В вашем хранилище достаточно продуктов для выбранных рецептов'
								)
							await createCheckList(checklist.filter(item => !!item))
						}}>
						Сформировать список продуктов
					</button>
				</div>
			</div>
			<div className={styles.container}>
				<div className={styles.cardsContainer}>
					{data?.pages.map(page =>
						page.recipesData
							.filter(item =>
								item.recipe.title.toLowerCase().includes(search.toLowerCase())
							)
							.map(item => (
								<div
									className={styles.card}
									style={{
										border: `1px solid ${
											selectedRecipes[item.recipe.id] ? 'red' : 'white'
										}`,
									}}
									key={item.recipe.id}
									onClick={() =>
										setSelectedRecipes(prev => ({
											...prev,
											[item.recipe.id]: !prev[item.recipe.id],
										}))
									}>
									<p>{item.recipe.title}</p>
									<div>
										<div>
											<p>Тип: {item.recipe.type}</p>
											<p>
												Дата создания:{' '}
												{new Date(item.recipe.createdAt).toLocaleDateString()}
											</p>
											<p>
												Подтвержден: {item.recipe.isApproved ? 'да' : 'нет'}
											</p>
											<p>Видимый: {item.recipe.isVisible ? 'да' : 'нет'}</p>
											<p>ID создателя: {item.recipe.creatorId}</p>
											<p>Описание: {item.recipe.description}</p>
											{item.recipe.products.map(product => (
												<div
													style={{
														display: 'flex',
														flexDirection: 'row',
														justifyContent: 'space-around',
													}}
													key={product.id}>
													<div
														style={{
															display: 'flex',
															flexDirection: 'column',
														}}>
														<p>{product.title} </p>
														<div
															style={{
																display: 'flex',
																flexDirection: 'row',
																justifyContent: 'center',
																gap: 10,
																border: '1px solid black',
															}}>
															<p>Белки: {product.protein}</p>
															<p>Жиры: {product.fats} </p>
														</div>
														<div
															style={{
																display: 'flex',
																flexDirection: 'row',
																justifyContent: 'center',
																border: '1px solid black',
																gap: 10,
															}}>
															<p>Углеводы: {product.carbohydrates} </p>
															<p>Калории: {product.calories} </p>
														</div>
														<div>Количество: {product.quantity}</div>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							))
					)}
				</div>
			</div>
		</>
	)
}
