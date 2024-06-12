import noimage from '@client/assets/noimage.png'
import Modal from '@client/components/Modal'
import s from '@client/components/RecipeCard/recipeCard.module.scss'
import Textarea from '@client/components/Textarea'
import { recipeTypesConverter } from '@client/utils/converters/recipeTypes'
import { unitsConverter } from '@client/utils/converters/units'
import { RecipeTypes, Units } from '@prisma/client'
import { EntityType } from '@static/types'

export default function ShowFullRecipeModal({
	onCloseModal,
	recipeInfo,
}: IUpdateRecipeModalProps) {
	const recipeComposition = new Map<
		string,
		{
			id: string
			creatorId: string | null
			title: string
			unit: Units
			quantity: number
		}
	>(
		recipeInfo.composition.map(i => [
			i.product.title,
			{ ...i.product, quantity: i.quantity },
		])
	)

	return (
		<Modal title={'Информация о рецепте'} onCloseModal={onCloseModal}>
			<div style={{ width: '100%' }}>
				<div style={{ padding: '8px 0' }}>
					<img
						src={`http://localhost:3005/${EntityType.recipes}/${recipeInfo.id}?t=${new Date().getTime()}`}
						className={s.image}
						alt={''}
						onError={({ currentTarget }) => {
							currentTarget.onerror = null // prevents looping
							currentTarget.src = noimage
						}}
					/>
				</div>
				<div
					style={{
						display: 'flex',
						width: '100%',
						justifyContent: 'space-between',
						gap: '16px',
					}}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '16px',
						}}>
						<div>
							<h1 style={{ color: 'white' }}> {recipeInfo.title}</h1>
							<h3>{recipeTypesConverter[recipeInfo.type]}</h3>
						</div>
						{!!recipeComposition.size && (
							<table
								border={2}
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
									{[...recipeComposition].map(productName => {
										const product = productName[1]!
										return (
											<tr key={product.id}>
												<td>{product.title}</td>
												<td>{product.quantity}</td>
												<td>{unitsConverter[product.unit]}</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						)}
					</div>
					<Textarea
						editable={false}
						label={'Как приготовить'}
						value={recipeInfo.description}
						onChange={() => {}}
					/>
				</div>
				<div
					style={{
						padding: '15px',
						display: 'flex',
						gap: '8px',
						justifyContent: 'center',
					}}>
					{/*<Button*/}
					{/*	disabled={*/}
					{/*		!recipeInfo.title ||*/}
					{/*		!regex.productName.test(recipeInfo.title)*/}
					{/*	}*/}
					{/*	text={'Сохранить'}*/}
					{/*	action={async () =>*/}
					{/*		mutateAsync({*/}
					{/*			info: recipeInfo,*/}
					{/*			composition: [...recipeComposition.values()].map(*/}
					{/*				product => ({*/}
					{/*					productId: product.id,*/}
					{/*					quantity: product.quantity,*/}
					{/*				})*/}
					{/*			),*/}
					{/*		})*/}
					{/*	}*/}
					{/*/>*/}
					{/*<Button*/}
					{/*	text={'Отмена'}*/}
					{/*	style={{ borderColor: 'orangered' }}*/}
					{/*	action={() =>*/}
					{/*		setRecipeInfo({ ...initialState, composition: undefined })*/}
					{/*	}*/}
					{/*/>*/}
				</div>
			</div>
		</Modal>
	)
}

interface IUpdateRecipeModalProps {
	onCloseModal: () => void
	recipeInfo: {
		title: string
		isOfficial: boolean
		isFrozen: boolean
		isPrivate: boolean
		creatorId: string | null
		description: string
		type: RecipeTypes
		id: string
		composition: {
			product: {
				title: string
				creatorId: string | null
				id: string
				unit: Units
			}
			quantity: number
		}[]
	}
}
