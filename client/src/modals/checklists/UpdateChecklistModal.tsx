import Button from '@client/components/Button'
import { Input } from '@client/components/Input'
import Modal from '@client/components/Modal'
import { useUpdateChecklist } from '@client/queries/checklists/useUpdateChecklist'
import useVirtualStore from '@client/storage'
import { unitsConverter } from '@client/utils/converters/units'
import { Decimal } from '@prisma/client/runtime/library'
import { useState } from 'react'
import { Currencies, Units } from '~shared/enums'

export default function UpdateChecklistModal({
	onCloseModal,
	checklistInfo,
}: IUpdateRecipeModalProps) {
	const { userId } = useVirtualStore()
	const [composition, setComposition] = useState(
		new Map<
			string,
			{
				product: { title: string; unit: Units }
				checklistId: string
				productId: string
				productQuantity: number
				price: Decimal
				currency: Currencies
			}
		>(checklistInfo.ChecklistComposition.map(i => [i.productId, i]))
	)

	const { mutateAsync } = useUpdateChecklist({ onSuccess: onCloseModal })

	return (
		<Modal
			title={`Список покупок от ${new Date(checklistInfo.createdAt).toLocaleDateString()} ${new Date(checklistInfo.createdAt).toLocaleTimeString()}`}
			onCloseModal={onCloseModal}>
			<div style={{ width: '100%' }}>
				<div
					style={{
						display: 'flex',
						width: '100%',
						justifyContent: 'center',
						alignItems: 'center',
						gap: '16px',
						flexDirection: 'column',
					}}>
					<div>
						<h3>
							{checklistInfo.isConfirmed
								? 'Подтвержден'
								: 'Ожидается подтверждение'}
						</h3>
					</div>
					{!!composition.size && (
						<table
							border={2}
							style={{
								borderColor: '#26d312',
								color: 'white',
								padding: '8px',
								borderCollapse: 'collapse',
								width: '70%',
							}}>
							<thead>
								<tr>
									<th style={{ padding: '8px', color: 'white' }}>
										Название
									</th>
									<th style={{ padding: '8px', color: 'white' }}>
										Количество
									</th>
									<th style={{ padding: '8px', color: 'white' }}>
										Размерность
									</th>
								</tr>
							</thead>
							<tbody>
								{[...composition.values()].map(product => {
									return (
										<tr key={product.productId}>
											<td style={{ padding: '8px' }}>
												{product.product.title}
											</td>
											<td style={{ padding: '8px' }}>
												<Input
													value={product.productQuantity}
													type={'number'}
													onChange={e =>
														setComposition(
															prev =>
																new Map(
																	prev.set(product.productId, {
																		...prev.get(
																			product.productId
																		)!,
																		productQuantity:
																			+e.target.value,
																	})
																)
														)
													}
													label={''}
													placeholder={'Введите количество'}
												/>
											</td>
											<td style={{ padding: '8px' }}>
												{unitsConverter[product.product.unit]}
											</td>
											<td
												style={{
													padding: '8px',
												}}>
												<Button
													style={{ borderColor: 'orangered' }}
													text={'Удалить'}
													action={() =>
														setComposition(prev => {
															prev.delete(product.productId)
															return new Map(prev)
														})
													}
												/>
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					)}
				</div>
				<div
					style={{
						padding: '15px',
						display: 'flex',
						gap: '8px',
						justifyContent: 'center',
						width: '30%',
						margin: 'auto',
					}}>
					<Button
						text={'Сохранить'}
						action={async () =>
							mutateAsync({
								userId: userId!,
								checklistId: checklistInfo.id,
								products: [...composition.values()].map(i => ({
									id: i.productId,
									quantity: i.productQuantity,
								})),
							})
						}
					/>
				</div>
			</div>
		</Modal>
	)
}

interface IUpdateRecipeModalProps {
	onCloseModal: () => void
	checklistInfo: {
		id: string
		creatorId: string
		createdAt: Date
		isConfirmed: boolean
		lastUpdatedAt: Date
		ChecklistComposition: {
			product: { title: string; unit: Units }
			checklistId: string
			productId: string
			productQuantity: number
			price: Decimal
			currency: Currencies
		}[]
	}
}
