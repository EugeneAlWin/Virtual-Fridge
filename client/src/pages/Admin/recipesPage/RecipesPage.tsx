import { ICreateRecipeRequest } from '@client/api/recipes/dto/createRecipe'
import { IUpdateRecipeResponse } from '@client/api/recipes/dto/updateRecipe'
import { useGetAllProducts } from '@client/queries/products/useGetAllProducts'
import { useCreateRecipe } from '@client/queries/recipes/useCreateRecipe'
import { useDropRecipe } from '@client/queries/recipes/useDropRecipe'
import { useGetAllRecipes } from '@client/queries/recipes/useGetAllRecipes'
import { useUpdateRecipe } from '@client/queries/recipes/useUpdateRecipe'
import useVirtualStore from '@client/storage'
import { RecipeTypes, Units } from '@prisma/client'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import styles from './recipesPage.module.scss'

export const RecipesPage = () => {
	const { userId } = useVirtualStore()

	const newRecipeInitState = {
		recipeComposition: [],
		isVisible: false,
		type: RecipeTypes.VEGETARIAN_DISHES,
		title: '',
		creatorId: +userId!,
	} satisfies ICreateRecipeRequest

	const [search, setSearch] = useState('')
	const [searchProduct, setSearchProduct] = useState('')
	const [newRecipe, setNewRecipe] =
		useState<ICreateRecipeRequest>(newRecipeInitState)
	const [selectedRecipe, setSelectedRecipe] = useState<IUpdateRecipeResponse>(
		{} as IUpdateRecipeResponse
	)
	const [productsModal, setProductsModal] = useState(
		[] as {
			productId: number
			title: string
			quantity: number
			units: Units
		}[]
	)

	const { data: productsData, refetch } = useGetAllProducts({
		title: searchProduct,
	})

	const { data, error, isLoading } = useGetAllRecipes({ title: search })
	const { mutateAsync: dropRecipe } = useDropRecipe()
	const {
		mutateAsync: createRecipe,
		isError: isCreateError,
		error: createError,
	} = useCreateRecipe()
	const {
		mutateAsync: updateRecipe,
		isError: isUpdateError,
		error: updateError,
	} = useUpdateRecipe()

	useEffect(() => {
		if (isCreateError)
			toast(createError?.field + ' ' + createError.message, {
				type: 'error',
			})
		if (isUpdateError)
			toast(updateError?.field + ' ' + updateError.message, {
				type: 'error',
			})
	}, [
		createError?.field,
		createError?.message,
		isCreateError,
		isUpdateError,
		updateError?.field,
		updateError?.message,
	])

	useEffect(() => {
		refetch().finally()
	}, [refetch, searchProduct])

	if (isLoading) return <h2>Loading...</h2>
	if (error) return <p>Error</p>
	return (
		<>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
				}}>
				<SearchInput
					search={search}
					onChange={e => setSearch(e.target.value)}
				/>
			</div>
			<div className={styles.container}>
				<div className={styles.modal}>
					{Object.values(selectedRecipe).length ? (
						<>
							<p>Редактирование рецепта</p>
							<div className={styles.div}>
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
							<div className={styles.div}>
								<p>Тип</p>
								<select
									value={selectedRecipe.type}
									onChange={e =>
										setSelectedRecipe(prev => ({
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
							<div className={styles.div}>
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
							<div className={styles.div}>
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
							<div className={styles.div} style={{ zIndex: 3 }}>
								<p>Описание</p>
								<textarea
									value={selectedRecipe.description || ''}
									onChange={e =>
										setSelectedRecipe(prev => ({
											...prev,
											description: e.target.value,
										}))
									}
								/>
							</div>
							<div>
								<p>Поиск продуктов</p>
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
																	item =>
																		item.productId ===
																		product.id
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
												justifyContent: 'space-evenly',
												alignItems: 'center',
												gap: '5px',
											}}>
											<p>{item.title}</p>
											<input
												type='number'
												value={item.quantity}
												step={1}
												min={0}
												onChange={e =>
													setProductsModal(prev =>
														prev.map(product => {
															if (
																product.productId !==
																item.productId
															)
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
												className={styles.delete}
												onClick={() =>
													setProductsModal(prev =>
														prev.filter(
															product =>
																product.productId !==
																item.productId
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
									disabled={
										selectedRecipe.title === '' ||
										!productsModal.length
									}
									onClick={async () => {
										await updateRecipe({
											selectedRecipe,
											productsModal,
										})
										setSelectedRecipe({} as IUpdateRecipeResponse)
										setProductsModal([])
									}}>
									Сохранить
								</button>
								<button
									onClick={() => {
										setSelectedRecipe({} as IUpdateRecipeResponse)
										setProductsModal([])
									}}>
									Отменить
								</button>
							</div>
						</>
					) : (
						<>
							<p>Создание рецепта</p>
							<div className={styles.div}>
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
							<div className={styles.div}>
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
							<div className={styles.div}>
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
							<div className={styles.div}>
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
								<p>Поиск продуктов</p>
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
																	item =>
																		item.productId ===
																		product.id
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
												step={1}
												min={0}
												onChange={e =>
													setProductsModal(prev =>
														prev.map(product => {
															if (
																product.productId !==
																item.productId
															)
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
															product =>
																product.productId !==
																item.productId
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
									disabled={
										newRecipe.title === '' || !productsModal.length
									}
									onClick={async () => {
										await createRecipe({ newRecipe, productsModal })
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
								item.recipe.title
									.toLowerCase()
									.includes(search.toLowerCase())
							)
							.map(item => (
								<div className={styles.card} key={item.recipe.id}>
									<p>{item.recipe.title}</p>
									<div>
										<div>
											<p>Тип: {item.recipe.type}</p>
											<p>
												Дата создания:{' '}
												{new Date(
													item.recipe.createdAt
												).toLocaleDateString()}
											</p>
											<p>
												Подтвержден:{' '}
												{item.recipe.isApproved ? 'да' : 'нет'}
											</p>
											<p>
												Видимый:{' '}
												{item.recipe.isVisible ? 'да' : 'нет'}
											</p>
											{item.recipe.description && (
												<p>Описание: {item.recipe.description}</p>
											)}
											{item.recipe.products.map(product => (
												<div
													style={{
														display: 'flex',
														flexDirection: 'column',
														justifyContent: 'space-around',
													}}
													key={product.id}>
													<h4>{product.title} </h4>
													<div
														style={{
															display: 'flex',
															flexDirection: 'row',
															justifyContent: 'center',
															gap: '2%',
														}}>
														<p>Б: {product.protein}</p>
														<p>Ж: {product.fats} </p>
														<p>У: {product.carbohydrates} </p>
														<p>Кал: {product.calories} </p>
													</div>
													<p>
														Кол-во: {product.quantity}{' '}
														{product.units}
													</p>
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
															item.recipe.description || '',
													} as IUpdateRecipeResponse) //TODO: types

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
				<ToastContainer />
			</div>
		</>
	)
}
