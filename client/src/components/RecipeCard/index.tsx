import noimage from '@client/assets/noimage.png'
import Button from '@client/components/Button'
import { useDropRecipe } from '@client/queries/recipes/useDropRecipe'
import useVirtualStore from '@client/storage'
import { recipeTypesConverter } from '@client/utils/converters/recipeTypes'
import { EntityType } from '@static/types'
import { RecipeTypes, Roles } from '~shared/enums'
import s from './recipeCard.module.scss'

export default function RecipeCard({
	recipeInfo,
	onEditPress,
	selected,
	onShowFullRecipe,
	onSelect,
}: IProductCardProps) {
	const { mutateAsync } = useDropRecipe({})
	const { userId, role } = useVirtualStore()
	return (
		<div>
			<div
				onClick={onSelect}
				className={s.container}
				style={{ borderColor: selected ? '#26d312' : undefined }}>
				<img
					src={`http://localhost:3005/${EntityType.recipes}/${recipeInfo.id}?t=${new Date().getTime()}`}
					className={s.image}
					alt={''}
					onError={({ currentTarget }) => {
						currentTarget.onerror = null // prevents looping
						currentTarget.src = noimage
					}}
				/>
				<h2>{recipeInfo.title}</h2>
				<div className={s.pfc}>
					<p>{recipeTypesConverter[recipeInfo.type]}</p>
				</div>
				<div className={s.controls} onClick={e => e.stopPropagation()}>
					<Button text={'Подробнее...'} action={onShowFullRecipe} />
					{(userId === recipeInfo.creatorId || role !== Roles.DEFAULT) && (
						<>
							<Button
								text={'Редактировать рецепт'}
								action={onEditPress}
							/>
							<Button
								text={'Удалить рецепт'}
								style={{ borderColor: 'orangered' }}
								action={async () => mutateAsync(recipeInfo.id)}
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
	selected?: boolean
	onShowFullRecipe: () => void
	recipeInfo: {
		id: string
		creatorId: string | null
		title: string
		type: RecipeTypes
		description: string | null
		createdAt: Date
		isPrivate: boolean
		isOfficial: boolean
		isFrozen: boolean
	}
	onSelect?: () => void
}
