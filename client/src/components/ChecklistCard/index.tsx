import Button from '@client/components/Button'
import s from './checklistCard.module.scss'

export default function ChecklistCard({
	checklistInfo,
	onConfirm,
}: IChecklistCardProps) {
	return (
		<div>
			<div className={s.container}>
				<h3>
					{new Date(checklistInfo.createdAt).toLocaleDateString() +
						' ' +
						new Date(checklistInfo.createdAt).toLocaleTimeString()}
				</h3>
				<div className={s.controls}>
					<Button
						disabled={checklistInfo.isConfirmed}
						text={
							checklistInfo.isConfirmed
								? 'Покупка подтверждена'
								: 'Подтвердить покупку'
						}
						action={onConfirm}
					/>
				</div>
			</div>
		</div>
	)
}

interface IChecklistCardProps {
	onConfirm: () => void
	checklistInfo: {
		id: string
		creatorId: string
		createdAt: Date
		isConfirmed: boolean
		lastUpdatedAt: Date
	}
}
