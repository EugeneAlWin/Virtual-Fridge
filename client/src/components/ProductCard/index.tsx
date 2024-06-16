import noimage from '@client/assets/noimage.png'
import Button from '@client/components/Button'
import useVirtualStore from '@client/storage'
import { unitsConverter } from '@client/utils/converters/units'
import { EntityType } from '@static/types'
import { Roles, Units } from '~shared/enums'
import s from './productCard.module.scss'

export default function ProductCard({
	productInfo,
	onEditPress,
	onAddToStoragePress,
	inStoreInfo,
	onDropPress,
}: IProductCardProps) {
	const { userId, role } = useVirtualStore()
	return (
		<div>
			<div className={s.container}>
				<img
					src={`http://localhost:3005/${EntityType.products}/${productInfo.id}?t=${new Date().getTime()}`}
					className={s.image}
					alt={''}
					onError={({ currentTarget }) => {
						currentTarget.onerror = null // prevents looping
						currentTarget.src = noimage
					}}
				/>
				<h2>{productInfo.title}</h2>
				<div className={s.pfc}>
					<p>Б: {productInfo.protein}</p>
					<p>Ж: {productInfo.fats}</p>
					<p>У: {productInfo.carbohydrates}</p>
					<p>Кал: {productInfo.calories}</p>
				</div>
				{inStoreInfo && (
					<div className={s.quantity}>
						<p>{inStoreInfo.quantity}</p>
						<p>{unitsConverter[inStoreInfo.unit]}</p>
					</div>
				)}
				<div className={s.controls}>
					{role === Roles.DEFAULT && (
						<Button
							text={'Добавить в холодильник'}
							action={onAddToStoragePress}
						/>
					)}
					{(userId === productInfo.creatorId ||
						role !== Roles.DEFAULT) && (
						<>
							<Button
								text={'Редактировать продукт'}
								action={onEditPress}
							/>
							<Button
								text={'Удалить продукт'}
								style={{ borderColor: 'orangered' }}
								action={onDropPress}
							/>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

interface IProductCardProps {
	onEditPress: () => void
	onAddToStoragePress: () => void
	onDropPress: () => void
	productInfo: {
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
	inStoreInfo?: {
		unit: Units
		quantity: number
	}
}
