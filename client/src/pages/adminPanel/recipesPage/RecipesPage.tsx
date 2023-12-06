import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import $api from '../../../query/axios/base.ts'
import axios, { AxiosResponse } from 'axios'
import styles from './recipesPage.module.scss'
import { useState } from 'react'
import { IDeleteProductsResponse } from '../../../api/products/dto/deleteProduct.ts'
import queryClient from '../../../query/queryClient.ts'
import RecipeEndpoints from '../../../api/recipes/endpoints.ts'
import { IGetAllRecipesResponse } from '../../../api/recipes/dto/getAllRecipes.ts'
import { IErrorResponse } from '../../../api/errorResponse.ts'
import { RecipeTypes, Units } from '../../../api/enums.ts'
import {
	ICreateRecipeRequest,
	ICreateRecipeResponse,
} from '../../../api/recipes/dto/createRecipe.ts'
import {
	IUpdateRecipeRequest,
	IUpdateRecipeResponse,
} from '../../../api/recipes/dto/updateRecipe.ts'
import { IGetAllProductsResponse } from '../../../api/products/dto/getAllProducts.ts'
import ProductEndpoints from '../../../api/products/endpoints.ts'

export const RecipesPage = () => {
	const { data, error, isLoading } = useInfiniteQuery<
		IGetAllRecipesResponse,
		IErrorResponse
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
						isVisible: false,
						isApproved: false,
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

	const { mutateAsync: dropRecipe } = useMutation({
		mutationFn: async (id: number) => {
			try {
				const result = await $api.delete<IDeleteProductsResponse>(
					`${RecipeEndpoints.BASE}${RecipeEndpoints.DELETE}`,
					{
						data: {
							recipesId: [id],
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
				queryKey: ['recipes'],
			})
		},
	})

	const newRecipeInitState = {
		recipeComposition: [],
		isVisible: false,
		type: RecipeTypes.VEGETARIAN,
		title: '',
		creatorId: 11,
	} satisfies ICreateRecipeRequest
	const [newRecipe, setNewRecipe] = useState<ICreateRecipeRequest>(newRecipeInitState)

	const [selectedRecipe, setSelectedRecipe] = useState<null | IUpdateRecipeRequest>(null)

	const { mutateAsync: createRecipe } = useMutation({
		mutationFn: async () => {
			try {
				const result = await $api.post<
					ICreateRecipeResponse,
					IErrorResponse,
					ICreateRecipeRequest
				>(`${RecipeEndpoints.BASE}${RecipeEndpoints.CREATE}`, {
					description: newRecipe.description,
					title: newRecipe.title,
					type: newRecipe.type,
					isVisible: newRecipe.isVisible,
					recipeComposition: productsModal.map(item => ({
						productId: item.productId,
						quantity: item.quantity,
						units: item.units,
					})),
					creatorId: 11, //TODO
				})
				return result.data
			} catch (e) {
				if (axios.isAxiosError(e)) throw e?.response?.data
				throw e
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['recipes'],
			})
		},
	})

	const { mutateAsync: updateRecipe } = useMutation({
		mutationFn: async () => {
			try {
				if (!selectedRecipe) return
				const result = await $api.patch<
					IUpdateRecipeResponse,
					IErrorResponse,
					IUpdateRecipeRequest
				>(`${RecipeEndpoints.BASE}${RecipeEndpoints.UPDATE}`, {
					description: selectedRecipe.description,
					title: selectedRecipe.title,
					id: selectedRecipe.id,
					type: selectedRecipe.type,
					isVisible: selectedRecipe.isVisible,
					isApproved: selectedRecipe.isApproved,
					recipeComposition: productsModal.map(item => ({
						productId: item.productId,
						quantity: item.quantity,
						units: item.units,
					})),
				})
				return result.data
			} catch (e) {
				if (axios.isAxiosError(e)) throw e?.response?.data
				throw e
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['recipes'],
			})
		},
	})

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
					{selectedRecipe ? (
						<>
							<p>Редактирование рецепта</p>
							<div>
								<p>Название</p>
								<input
									type='text'
									value={selectedRecipe.title}
									onChange={e =>
										setSelectedRecipe(prev => ({
											...prev,
											title: e.target.value,
										}))
									}
								/>
							</div>
							<div>
								<p>Тип</p>
								<select
									value={selectedRecipe.type}
									onChange={e =>
										setSelectedRecipe(prev => ({
											...prev,
											type: e.target.value,
										}))
									}>
									{Object.values(RecipeTypes).map(item => (
										<option key={item} value={item}>
											{item}
										</option>
									))}
								</select>
							</div>
							<div>
								<p>Видимый</p>
								<input
									type='checkbox'
									checked={selectedRecipe.isVisible}
									onChange={e =>
										setSelectedRecipe(prev => ({
											...prev,
											isVisible: e.target.checked,
										}))
									}
								/>
							</div>
							<div>
								<p>Подтвержден</p>
								<input
									type='checkbox'
									checked={selectedRecipe.isApproved}
									onChange={e =>
										setSelectedRecipe(prev => ({
											...prev,
											isApproved: e.target.checked,
										}))
									}
								/>
							</div>
							<div>
								<p>Описание</p>
								<textarea
									value={selectedRecipe.description}
									onChange={e =>
										setSelectedRecipe(prev => ({
											...prev,
											description: e.target.value,
										}))
									}
								/>
							</div>
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
									onClick={async () => {
										await updateRecipe()
										setSelectedRecipe(null)
										setProductsModal([])
									}}>
									Сохранить
								</button>
								<button
									onClick={() => {
										setSelectedRecipe(null)
										setProductsModal([])
									}}>
									Отменить
								</button>
							</div>
						</>
					) : (
						<>
							<p>Создание рецепта</p>
							<div>
								<p>Название</p>
								<input
									type='text'
									value={newRecipe.title}
									onChange={e =>
										setNewRecipe(prev => ({
											...prev,
											title: e.target.value,
										}))
									}
								/>
							</div>
							<div>
								<p>Тип</p>
								<select
									value={newRecipe.type}
									onChange={e =>
										setNewRecipe(prev => ({
											...prev,
											type: e.target.value as RecipeTypes,
										}))
									}>
									{Object.values(RecipeTypes).map(item => (
										<option key={item} value={item}>
											{item}
										</option>
									))}
								</select>
							</div>
							<div>
								<p>Видимый</p>
								<input
									type='checkbox'
									checked={newRecipe.isVisible}
									onChange={e =>
										setNewRecipe(prev => ({
											...prev,
											isVisible: e.target.checked,
										}))
									}
								/>
							</div>
							<div>
								<p>Описание</p>
								<textarea
									value={newRecipe.description}
									onChange={e =>
										setNewRecipe(prev => ({
											...prev,
											description: e.target.value,
										}))
									}
								/>
							</div>
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
									onClick={async () => {
										await createRecipe()
										setProductsModal([])
									}}>
									Сохранить
								</button>
								<button
									onClick={() => {
										setNewRecipe(newRecipeInitState)
										setProductsModal([])
									}}>
									Отменить
								</button>
							</div>
						</>
					)}
				</div>
				<div className={styles.cardsContainer}>
					{data?.pages.map(page =>
						page.recipesData
							.filter(item =>
								item.recipe.title.toLowerCase().includes(search.toLowerCase())
							)
							.map(item => (
								<div className={styles.card} key={item.recipe.id}>
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
													<p>{product.title} </p>
													<p>{product.protein} </p>
													<p>{product.fats} </p>
													<p>{product.carbohydrates} </p>
													<p>{product.calories} </p>
													<p>{product.quantity}</p>
													<p>{product.units}</p>
												</div>
											))}
										</div>

										<div className={styles.cardEditBar}>
											<button
												onClick={() => {
													setSelectedRecipe({
														title: item.recipe.title,
														type: item.recipe.type,
														isVisible: item.recipe.isVisible,
														isApproved: item.recipe.isApproved,
														id: item.recipe.id,
														description:
															item.recipe.description || undefined,
													})

													setProductsModal(
														item.recipe.products.map(product => ({
															quantity: product.quantity,
															units: product.units as Units,
															productId: product.id,
															title: product.title,
														}))
													)
												}}>
												Редактировать
											</button>
											<button
												className={styles.redButton}
												onClick={async () =>
													await dropRecipe(item.recipe.id)
												}>
												Удалить навсегда
											</button>
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
