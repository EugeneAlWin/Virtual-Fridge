import { Search } from '@client/components/Search'
import { useCreateProduct } from '@client/queries/products/useCreateProduct'
import { useDropProduct } from '@client/queries/products/useDropProduct'
import { useGetAllProducts } from '@client/queries/products/useGetAllProducts'
import { useUpdateProduct } from '@client/queries/products/useUpdateProduct'
import useVirtualStore from '@client/storage'
import { Units } from '@prisma/client'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import styles from './productPage.module.scss'

export const ProductsPage = () => {
	const { userId } = useVirtualStore()
	const [selectedProduct, setSelectedProduct] = useState<{
		id: string
		creatorId: string | null
		title: string
		calories: number
		protein: number
		fats: number
		carbohydrates: number
		unit: Units
		isOfficial: boolean | null
		isFrozen: boolean | null
		isRecipePossible: boolean | null
		averageShelfLifeInDays: number | null
	}>(
		{} as {
			id: string
			creatorId: string | null
			title: string
			calories: number
			protein: number
			fats: number
			carbohydrates: number
			unit: Units
			isOfficial: boolean | null
			isFrozen: boolean | null
			isRecipePossible: boolean | null
			averageShelfLifeInDays: number | null
		}
	)

	const newProductInitState: {
		averageShelfLifeInDays?: number
		isFrozen: boolean
		title: string
		calories: number
		protein: number
		fats: number
		carbohydrates: number
		unit: Units
		isOfficial: boolean
		creatorId: string
		isRecipePossible: boolean
	} = {
		title: '',
		carbohydrates: 0,
		calories: 0,
		fats: 0,
		protein: 0,
		unit: Units.GRAMS,
		isOfficial: false,
		isFrozen: false,
		isRecipePossible: false,
		creatorId: userId!,
	}

	const [newProduct, setNewProduct] = useState<{
		averageShelfLifeInDays?: number
		isFrozen: boolean
		title: string
		calories: number
		protein: number
		fats: number
		carbohydrates: number
		unit: Units
		isOfficial: boolean
		isRecipePossible: boolean
		creatorId: string
	}>(newProductInitState)

	const [search, setSearch] = useState('')
	const { data, fetchNextPage, hasNextPage } = useGetAllProducts({
		title: search,
	})

	const {
		mutateAsync: dropProduct,
		isError: isDropError,
		isSuccess: isDropSuccess,
	} = useDropProduct()

	const {
		mutateAsync: createProduct,
		isError: isCreateError,
		isSuccess: isCreateProductSuccess,
	} = useCreateProduct()

	const {
		mutateAsync: updateProduct,
		isError: isUpdateError,
		isSuccess: isUpdateProductSuccess,
	} = useUpdateProduct()

	useEffect(() => {
		if (isCreateError)
			toast('Ошибка создания продукта!', {
				type: 'error',
			})
		if (isUpdateError)
			toast('Ошибка обновления продукта!', {
				type: 'error',
			})
	}, [
		isCreateError,
		isUpdateError,
		isUpdateProductSuccess,
		isCreateProductSuccess,
		isDropError,
		isDropSuccess,
	])
	if (!data) return <></>
	const pages = data.pages.map(page => page.products).flat(1)
	return (
		<>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
				}}>
				<Search
					search={search}
					onChange={e => setSearch(e.target.value)}
					label={'Найти продукт'}
				/>
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
									value={selectedProduct.unit}
									onChange={e =>
										setSelectedProduct(prev => ({
											...prev,
											unit: e.target.value as Units,
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
										await updateProduct({
											isFrozen: selectedProduct?.isFrozen,
											title: selectedProduct?.title,
											calories: selectedProduct?.calories,
											protein: selectedProduct?.protein,
											fats: selectedProduct?.fats,
											carbohydrates: selectedProduct?.carbohydrates,
											id: selectedProduct?.id,
										})
										setSelectedProduct({})
									}}>
									Сохранить
								</button>
								<button onClick={() => setSelectedProduct({})}>
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
									value={newProduct.unit}
									onChange={e =>
										setNewProduct(prev => ({
											...prev,
											unit: e.target.value as Units,
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
								<button
									onClick={() => setNewProduct(newProductInitState)}>
									Отменить
								</button>
							</div>
						</div>
					)}
				</div>
				<div className={styles.cardsContainer}>
					{pages.map(item => (
						<div className={styles.card} key={item.id}>
							<p>{item.title}</p>
							<div>
								<div>
									<p>Ккал: {item.calories}</p>
									<p>Б: {item.protein}</p>
									<p>Ж: {item.fats}</p>
									<p>У: {item.carbohydrates}</p>
									<p>Единицы: {item.unit}</p>
								</div>
								<div className={styles.cardEditBar}>
									<button onClick={() => setSelectedProduct(item)}>
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
					))}
					{hasNextPage && (
						<button onClick={() => fetchNextPage()}>Ещё</button>
					)}
				</div>
				<ToastContainer />
			</div>
		</>
	)
}
