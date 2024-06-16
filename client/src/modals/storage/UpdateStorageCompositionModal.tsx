import Button from '@client/components/Button'
import { Input } from '@client/components/Input'
import Modal from '@client/components/Modal'
import ProductsDropdown from '@client/components/ProductsDropdown'
import { useSetStorageComposition } from '@client/queries/storages/useSetStorageComposition'
import { unitsConverter } from '@client/utils/converters/units'
import { useState } from 'react'
import { Units } from '~shared/enums'

export default function UpdateStorageCompositionModal({
	onCloseModal,
	storageId,
}: ICreateRecipeModalProps) {
	const [search, setSearch] = useState('')

	const [selectedProducts, setSelectedProducts] = useState(
		new Map<
			string,
			{
				id: string
				creatorId: string | null
				title: string
				unit: Units
				quantity: number
			}
		>()
	)

	const { mutateAsync } = useSetStorageComposition({
		onSuccess: onCloseModal,
	})

	return (
		<Modal title={'Пополнение хранилища'} onCloseModal={onCloseModal}>
			<div style={{ width: '100%' }}>
				<div
					style={{
						display: 'flex',
						width: '100%',
						justifyContent: 'center',
						gap: '16px',
					}}>
					<div>
						<ProductsDropdown
							search={search}
							onChange={setSearch}
							setMap={setSelectedProducts}
						/>
						{!!selectedProducts.size && (
							<table
								border={1}
								style={{
									borderColor: '#26d312',
									color: 'white',
									borderCollapse: 'collapse',
								}}>
								<thead>
									<tr>
										<th>Название</th>
										<th>Количество</th>
										<th>Размерность</th>
									</tr>
								</thead>
								<tbody>
									{[...selectedProducts].map(productName => {
										const product = productName[1]!
										return (
											<tr key={product.id}>
												<td>{product.title}</td>
												<td>
													<Input
														value={product.quantity}
														type={'number'}
														label={''}
														onChange={e =>
															setSelectedProducts(
																prev =>
																	new Map(
																		prev.set(productName[0], {
																			...prev.get(
																				productName[0]
																			)!,
																			quantity:
																				+e.target.value,
																		})
																	)
															)
														}
														placeholder={'Кол-во'}
													/>
												</td>
												<td>{unitsConverter[product.unit]}</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						)}
					</div>
				</div>
				<div
					style={{
						padding: '15px',
						display: 'flex',
						gap: '8px',
						justifyContent: 'center',
					}}>
					<Button
						disabled={!selectedProducts.size}
						text={'Сохранить'}
						action={async () =>
							mutateAsync({
								storeComposition: [...selectedProducts.values()].map(
									product => ({
										storageId,
										productId: product.id,
										productQuantity: product.quantity,
									})
								),
							})
						}
					/>
					<Button
						text={'Отмена'}
						style={{ borderColor: 'orangered' }}
						action={() => setSelectedProducts(new Map())}
					/>
				</div>
			</div>
		</Modal>
	)
}

interface ICreateRecipeModalProps {
	onCloseModal: () => void
	storageId: string
}
