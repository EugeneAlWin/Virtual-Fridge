import Button from '@client/components/Button'
import { Currencies, Units } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import s from './checklistCard.module.scss'

export default function ChecklistCard({
	checklistInfo,
	onConfirm,
	onEdit,
	onShow,
	onDrop,
}: IChecklistCardProps) {
	return (
		<div>
			<div className={s.container}>
				<h3>
					{new Date(checklistInfo.createdAt).toLocaleDateString() +
						' ' +
						new Date(checklistInfo.createdAt).toLocaleTimeString()}
				</h3>
				<div className={s.controls} style={{ display: 'flex', gap: '8px' }}>
					<div
						style={{
							gap: '8px',
							display: 'flex',
							flexDirection: 'column',
						}}>
						<Button
							disabled={checklistInfo.isConfirmed}
							text={
								checklistInfo.isConfirmed
									? 'Покупка подтверждена'
									: 'Подтвердить покупку'
							}
							style={{
								color: checklistInfo.isConfirmed ? 'unset' : undefined,
							}}
							action={onConfirm}
						/>
						<Button text={'Подробнее...'} action={onShow} />
					</div>
					<div
						style={{
							gap: '8px',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						{!checklistInfo.isConfirmed && (
							<Button
								disabled={checklistInfo.isConfirmed}
								text={'Редактировать'}
								action={onEdit}
							/>
						)}
						<Button
							style={{ borderColor: 'orangered' }}
							text={'Удалить'}
							action={onDrop}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

interface IChecklistCardProps {
	onConfirm: () => void
	onEdit: () => void
	onShow: () => void
	onDrop: () => void
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
