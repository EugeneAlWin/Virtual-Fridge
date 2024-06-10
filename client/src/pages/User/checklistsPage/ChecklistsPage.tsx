import { useGetStorageComposition } from '@client/queries/storages/useGetStorageComposition'
import useVirtualStore from '@client/storage'
import { useNavigate } from 'react-router-dom'
import styles from './checklistsPage.module.scss'

export const UserChecklistsPage = () => {
	const { userId } = useVirtualStore()

	const navigate = useNavigate()

	const {
		data: storeData,
		isLoading,
		error,
	} = useGetStorageComposition(userId)

	if (isLoading) return <h2>Loading...</h2>
	if (error) return <p>Error</p>
	const data = storeData?.pages.map(i => i.composition).flat(1)
	return (
		<>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					height: '40px',
				}}></div>
			<div className={styles.container}>
				<div className={styles.cardsContainer}>
					{data?.map(item => {
						return (
							<div className={styles.card} key={item.id}>
								<div>
									Дата создания:{' '}
									{new Date(item.createdAt).toLocaleString()}
								</div>
								<div>
									Покупка подтверждена:{' '}
									{item.isConfirmed ? 'да' : 'нет'}
								</div>
								<button
									onClick={() =>
										navigate(`/user/checklists/${item.id}`)
									}>
									Посмотреть
								</button>
								<button
									onClick={async () => {
										const { checklistComposition, isConfirmed } =
											await updateChecklist({
												id: item.id,
												isConfirmed: !item.isConfirmed,
											})

										if (isConfirmed && storeData) {
											const newProductsData =
												checklistComposition.map<{
													productId: number
													quantity: number
													expires: Date | undefined
													price: number
													currency: keyof typeof Currencies
												}>(product => {
													const productInStore =
														storeData.storeComposition.find(
															item =>
																item.product?.id ===
																product.productId
														)
													if (productInStore)
														return {
															quantity:
																productInStore.quantity +
																product.quantity,
															expires: undefined,
															productId: product.productId,
															price: product.price,
															currency: product.currency,
														}
													return {
														quantity: product.quantity,
														expires: undefined,
														productId: product.productId,
														price: product.price,
														currency: product.currency,
													}
												})

											const newStorageData = [
												...newProductsData,
												...storeData.storeComposition
													.filter(
														item =>
															!newProductsData.some(
																s =>
																	s.productId ===
																	item.product?.id
															)
													)
													.map(product => ({
														quantity: product.quantity,
														expires: product.expires || undefined,
														productId: product.product?.id || 1,
														price: product.price,
														currency: product.currency,
													})),
											]
											await updateStorage({
												newChecklistData: newStorageData,
											})
										}
									}}>
									{item.isConfirmed
										? 'Открыть чек заново'
										: 'Подтвердить покупку'}
								</button>
							</div>
						)
					})}
				</div>
			</div>
		</>
	)
}
