import styles from './productPage.module.scss'
import { useEffect, useState } from 'react'
import { ICreateProductRequest } from '../../../api/products/dto/createProduct.ts'
import { IUpdateProductRequest } from '../../../api/products/dto/updateProduct.ts'
import { useGetAllProducts } from '../../../query/adminPanel/useGetAllProducts.ts'
import { useDropProduct } from '../../../query/adminPanel/useDropProduct.ts'
import { SearchInput } from '../../../components/searchInput/SearchInput.tsx'
import { Units } from '../../../api/enums.ts'
import { toast, ToastContainer } from 'react-toastify'
import { useCreateProduct } from '../../../query/adminPanel/useCreateProduct.ts'
import { useUpdateProduct } from '../../../query/adminPanel/useUpdateProduct.ts'

export const ProductsPage = () => {
	const [selectedProduct, setSelectedProduct] = useState<IUpdateProductRequest>(
		{} as IUpdateProductRequest
	)

	const newProductInitState: ICreateProductRequest = {
		creatorId: 0,
		title: '',
		carbohydrates: 0,
		calories: 0,
		fats: 0,
		protein: 0,
		units: 'GRAMS',
	}

	const [newProduct, setNewProduct] =
		useState<ICreateProductRequest>(newProductInitState)

	const { data, fetchNextPage, hasNextPage } = useGetAllProducts()
	const [search, setSearch] = useState('')

	const { dropProduct } = useDropProduct()

	const {
		mutateAsync: createProduct,
		isError: isCreateError,
		error: createError,
	} = useCreateProduct()

	const {
		mutateAsync: updateProduct,
		isError: isUpdateError,
		error: updateError,
	} = useUpdateProduct()

	useEffect(() => {
		if (isCreateError)
			toast(createError?.field + ' ' + createError.message, { type: 'error' })
		if (isUpdateError)
			toast(updateError?.field + ' ' + updateError.message, { type: 'error' })
	}, [
		createError?.field,
		createError?.message,
		isCreateError,
		isUpdateError,
		updateError?.field,
		updateError?.message,
	])

	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
				<SearchInput search={search} onChange={e => setSearch(e.target.value)} />
			</div>
			<div className={styles.container}>
				<div className={styles.modal}>
					{Object.keys(selectedProduct).length ? (
						<div className={styles.modal}>
							<p>Редактирование продукта</p>
							<div className={styles.div}>
								<p>Название</p>
								<input
									type='text'
									className={styles.input}
									value={selectedProduct.title}
									maxLength={20}
									onChange={e =>
										setSelectedProduct(prev => ({
											...prev,
											title: e.target.value,
										}))
									}
								/>
							</div>
							<div className={styles.div}>
								<p>Белки</p>
								<input
									type='number'
									min={0}
									step={1}
									max={32767}
									value={selectedProduct.protein}
									onChange={e =>
										setSelectedProduct(prev => ({
											...prev,
											protein: +e.target.value,
										}))
									}
								/>
							</div>
							<div className={styles.div}>
								<p>Жиры</p>
								<input
									type='number'
									min={0}
									step={1}
									max={32767}
									value={selectedProduct.fats}
									onChange={e =>
										setSelectedProduct(prev => ({
											...prev,
											fats: +e.target.value,
										}))
									}
								/>
							</div>
							<div className={styles.div}>
								<p>Углеводы</p>
								<input
									type='number'
									step={1}
									min={0}
									max={32767}
									value={selectedProduct.carbohydrates}
									onChange={e =>
										setSelectedProduct(prev => ({
											...prev,
											carbohydrates: +e.target.value,
										}))
									}
								/>
							</div>
							<div className={styles.div}>
								<p>Ккал</p>
								<input
									type='number'
									step={1}
									value={selectedProduct.calories}
									max={32767}
									min={0}
									onChange={e =>
										setSelectedProduct(prev => ({
											...prev,
											calories: +e.target.value,
										}))
									}
								/>
							</div>
							<div className={styles.div}>
								<p>Единицы</p>
								<select
									name='unitsselect'
									id='unitsselectnew'
									value={selectedProduct.units}
									onChange={e =>
										setSelectedProduct(prev => ({
											...prev,
											units: e.target.value as Units,
										}))
									}>
									{Object.values(Units).map(unit => (
										<option value={unit}>{unit}</option>
									))}
								</select>
							</div>
							<div>
								<button
									disabled={selectedProduct.title === ''}
									onClick={async () => {
										await updateProduct(selectedProduct)
										setSelectedProduct({} as IUpdateProductRequest)
									}}>
									Сохранить
								</button>
								<button
									onClick={() =>
										setSelectedProduct({} as IUpdateProductRequest)
									}>
									Отменить
								</button>
							</div>
						</div>
					) : (
						<div className={styles.modal}>
							<p>Создание продукта</p>
							<div className={styles.div}>
								<p>Название</p>
								<input
									type='text'
									value={newProduct.title}
									maxLength={20}
									onChange={e =>
										setNewProduct(prev => ({
											...prev,
											title: e.target.value,
										}))
									}
								/>
							</div>
							<div className={styles.div}>
								<p>Белки</p>
								<input
									type='number'
									step={1}
									max={32767}
									min={0}
									value={newProduct.protein}
									onChange={e =>
										setNewProduct(prev => ({
											...prev,
											protein: +e.target.value,
										}))
									}
								/>
							</div>
							<div className={styles.div}>
								<p>Жиры</p>
								<input
									type='number'
									step={1}
									max={32767}
									min={0}
									value={newProduct.fats}
									onChange={e =>
										setNewProduct(prev => ({
											...prev,
											fats: +e.target.value,
										}))
									}
								/>
							</div>
							<div className={styles.div}>
								<p>Углеводы</p>
								<input
									type='number'
									step={1}
									max={32767}
									min={0}
									value={newProduct.carbohydrates}
									onChange={e =>
										setNewProduct(prev => ({
											...prev,
											carbohydrates: +e.target.value,
										}))
									}
								/>
							</div>
							<div className={styles.div}>
								<p>Ккал</p>
								<input
									type='number'
									max={32767}
									step={1}
									min={0}
									value={newProduct.calories}
									onChange={e =>
										setNewProduct(prev => ({
											...prev,
											calories: +e.target.value,
										}))
									}
								/>
							</div>
							<div className={styles.div}>
								<p>Единицы</p>
								<select
									name='unitsselect'
									id='unitsselect'
									value={newProduct.units}
									onChange={e =>
										setNewProduct(prev => ({
											...prev,
											units: e.target.value as Units,
										}))
									}>
									{Object.values(Units).map(unit => (
										<option value={unit}>{unit}</option>
									))}
								</select>
							</div>
							<div className={styles.buttons}>
								<button
									disabled={newProduct.title === ''}
									onClick={async () => {
										await createProduct(newProduct)
										setNewProduct(newProductInitState)
									}}>
									Сохранить
								</button>
								<button onClick={() => setNewProduct(newProductInitState)}>
									Отменить
								</button>
							</div>
						</div>
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
											<p>Единицы: {item.units}</p>
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
														units: item.units,
													})
												}>
												Редактировать
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
				<ToastContainer />
			</div>
		</>
	)
}
