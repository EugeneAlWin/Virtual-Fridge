import { useGetAllProducts } from '@client/queries/products/useGetAllProducts'
import useVirtualStore from '@client/storage'
import { Units } from '@prisma/client'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

export const UserChecklistPage = () => {
	const { userId } = useVirtualStore()

	const { checklistId } = useParams()

	const [search, setSearch] = useState('')

	const [searchProduct, setSearchProduct] = useState('')
	const { data: productsData } = useGetAllProducts({ title: searchProduct })

	const [productsModal, setProductsModal] = useState(
		[] as {
			productId: number
			title: string
			quantity: number
			units: Units
		}[]
	)
	return <></>
	// useEffect(() => {
	// 	if (isError)
	// 		toast(updateError?.field + ' ' + updateError?.message, {
	// 			type: 'error',
	// 			theme: 'dark',
	// 		})
	// 	if (isSuccess) toast('Хранилище обновлено!', { type: 'success' })
	// }, [updateError?.field, updateError?.message, isError, isSuccess])
	//
	// if (isLoading) return <h2>Loading...</h2>
	// if (error) return <p>Error</p>
	// if (!data) return <p>Данных нету</p>
	// return (
	// 	<>
	// 		<div
	// 			style={{
	// 				display: 'flex',
	// 				flexDirection: 'row',
	// 				justifyContent: 'center',
	// 			}}>
	// 			<Search
	// 				search={search}
	// 				onChange={e => setSearch(e.target.value)}
	// 			/>
	// 		</div>
	// 		<div className={styles.container}>
	// 			<div className={styles.modal}>
	// 				<>
	// 					<p>Добавление продукта</p>
	// 					<div>
	// 						<input
	// 							type='text'
	// 							value={searchProduct}
	// 							onChange={e => setSearchProduct(e.target.value)}
	// 						/>
	// 						{searchProduct && (
	// 							<div className={styles.productListContainer}>
	// 								{productsData?.pages.map(page =>
	// 									page.productsData.map(product => (
	// 										<div
	// 											key={product.id}
	// 											onClick={() => {
	// 												setProductsModal(prev => {
	// 													if (
	// 														prev.find(
	// 															item =>
	// 																item.productId === product.id
	// 														)
	// 													)
	// 														return prev
	// 													return [
	// 														...prev,
	// 														{
	// 															productId: product.id,
	// 															units: Units.GRAMS,
	// 															quantity: 0,
	// 															title: product.title,
	// 														},
	// 													]
	// 												})
	// 											}}>
	// 											{product.title}
	// 										</div>
	// 									))
	// 								)}
	// 							</div>
	// 						)}
	// 						<div>
	// 							<p>Состав рецепта:</p>
	// 							<div
	// 								style={{
	// 									display: 'flex',
	// 									flexDirection: 'row',
	// 									justifyContent: 'space-around',
	// 								}}>
	// 								<p>Название | </p>
	// 								<p>Кол-во | </p>
	// 								<p>Размерность</p>
	// 							</div>
	// 							{productsModal.map(item => (
	// 								<div
	// 									key={item.productId}
	// 									style={{
	// 										display: 'flex',
	// 										flexDirection: 'row',
	// 										justifyContent: 'space-around',
	// 										alignItems: 'center',
	// 										gap: '5%',
	// 									}}>
	// 									<p>{item.title}</p>
	// 									<input
	// 										type='number'
	// 										value={item.quantity}
	// 										step={1}
	// 										onChange={e =>
	// 											setProductsModal(prev =>
	// 												prev.map(product => {
	// 													if (
	// 														product.productId !==
	// 														item.productId
	// 													)
	// 														return product
	// 													return {
	// 														...product,
	// 														quantity: +e.target.value,
	// 													}
	// 												})
	// 											)
	// 										}
	// 									/>
	// 									<p>{item.units}</p>
	// 									<div
	// 										onClick={() =>
	// 											setProductsModal(prev =>
	// 												prev.filter(
	// 													product =>
	// 														product.productId !==
	// 														item.productId
	// 												)
	// 											)
	// 										}>
	// 										X
	// 									</div>
	// 								</div>
	// 							))}
	// 						</div>
	// 					</div>
	// 					<div>
	// 						<button
	// 							onClick={async () => {
	// 								await updateChecklist()
	// 							}}>
	// 							Синхронизировать
	// 						</button>
	// 						<button onClick={() => setProductsModal([])}>
	// 							Очистить
	// 						</button>
	// 					</div>
	// 				</>
	// 			</div>
	// 			<div className={styles.cardsContainer}>
	// 				{data?.checklistComposition
	// 					.filter(item =>
	// 						item.product?.title
	// 							.toLowerCase()
	// 							.includes(search.toLowerCase())
	// 					)
	// 					.map(item => (
	// 						<div className={styles.card} key={item.product?.id}>
	// 							<p>{item.product?.title}</p>
	// 							<div>
	// 								<div>
	// 									<p>Ккал: {item.product?.calories}</p>
	// 									<p>Б: {item.product?.protein}</p>
	// 									<p>Ж: {item.product?.fats}</p>
	// 									<p>У: {item.product?.carbohydrates}</p>
	// 								</div>
	// 								<div>
	// 									<p>Количество: {item.quantity}</p>
	// 								</div>
	// 							</div>
	// 						</div>
	// 					))}
	// 			</div>
	// 		</div>
	// 		<ToastContainer />
	// 	</>
	// )
}
