import { useEffect, useState } from 'react'
import styles from './recipesPage.module.scss'
import useVirtualStore from '../../../storage'
import { useGetAllRecipes } from '../../../query/adminPanel/useGetAllRecipes.ts'
import { useGetStore } from '../../../query/useGetStore.ts'
import { ChecklistCompositionData } from '../../../api/checklists/common.ts'
import { ProductData } from '../../../api/products/common.ts'
import { useCreateChecklist } from '../../../query/userPanel/useCreateCheckList.ts'
import { SearchInput } from '../../../components/searchInput/SearchInput.tsx'
import { toast, ToastContainer } from 'react-toastify'

export const UserRecipesPage = () => {
	const { userId } = useVirtualStore()

	const [search, setSearch] = useState('')
	const [selectedRecipes, setSelectedRecipes] = useState<{
		[recipeId: number]: boolean
	}>({})

	const { data, error, isLoading } = useGetAllRecipes(true)

	const { data: storeData } = useGetStore(userId)

	const { mutateAsync: createCheckList, isSuccess, isError } = useCreateChecklist(userId)

	useEffect(() => {
		if (isSuccess)
			toast('Список сформирован! Посмотреть можно на вкладке "Чек-листы"', {
				type: 'success',
				theme: 'dark',
			})
		if (isError)
			toast('Не удалось сформировать список :(', { type: 'error', theme: 'dark' })
	}, [isSuccess, isError])

	if (isLoading) return <h2>Loading...</h2>
	if (error) return <p>Error</p>
	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'row',
						gap: '5%',
					}}>
					<SearchInput search={search} onChange={e => setSearch(e.target.value)} />
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
								[title: string]: ProductData & { quantity: number }
							} = {}
							uniqueProducts =
								products?.reduce((prev, curr) => {
									const quantity = curr?.quantity
									const obj = {
										...curr,
										quantity: prev[curr.title]
											? (prev[curr.title].quantity += quantity)
											: quantity,
									}

									return {
										...prev,
										[curr.title]: obj,
									}
								}, uniqueProducts) || {}

							const checklist = Object.keys(
								uniqueProducts
							).map<ChecklistCompositionData | null>(title => {
								const productFromStore = storeData?.storeComposition.find(
									i => i.product?.title === title
								)
								if (productFromStore) {
									return productFromStore.quantity -
										uniqueProducts[title].quantity <
										0
										? {
												currency: 'BYN',
												price: 3,
												productId: uniqueProducts[title]?.id,
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
									price: 3,
									productId: uniqueProducts[title]?.id,
								}
							})
							if (checklist.every(item => !item))
								return toast(
									'В вашем хранилище достаточно продуктов для выбранных рецептов',
									{ type: 'info', theme: 'dark' }
								)

							await createCheckList(
								checklist.filter(item => !!item) as ChecklistCompositionData[]
							)
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
											{item.recipe.description && (
												<p>Описание: {item.recipe.description}</p>
											)}
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
			<ToastContainer />
		</>
	)
}
