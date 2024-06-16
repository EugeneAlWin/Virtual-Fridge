import Modal from '@client/components/Modal'
import { unitsConverter } from '@client/utils/converters/units'
import { Decimal } from '@prisma/client/runtime/library'
import { type Currencies, Units } from '~shared/enums'

export default function ShowFullChecklistModal({
	onCloseModal,
	checklistInfo,
}: IUpdateRecipeModalProps) {
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
					{!!checklistInfo.ChecklistComposition.length && (
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
								{checklistInfo.ChecklistComposition.map(product => {
									return (
										<tr key={product.productId}>
											<td style={{ padding: '8px' }}>
												{product.product.title}
											</td>
											<td style={{ padding: '8px' }}>
												{product.productQuantity}
											</td>
											<td style={{ padding: '8px' }}>
												{unitsConverter[product.product.unit]}
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					)}
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
