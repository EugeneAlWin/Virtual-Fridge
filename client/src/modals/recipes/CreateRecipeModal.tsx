import Button from '@client/components/Button'
import { Checkbox } from '@client/components/Checkbox'
import { Input } from '@client/components/Input'
import Modal from '@client/components/Modal'
import PhotoInput from '@client/components/PhotoInput'
import ProductsDropdown from '@client/components/ProductsDropdown'
import Select from '@client/components/Select'
import Textarea from '@client/components/Textarea'
import { useCreateRecipe } from '@client/queries/recipes/useCreateRecipe'
import useVirtualStore from '@client/storage'
import { unitsConverter } from '@client/utils/converters/units'
import { regex } from '@client/utils/regex'
import { RecipeTypes, Units } from '@prisma/client'
import { useState } from 'react'

export default function CreateRecipeModal({
	onCloseModal,
}: ICreateRecipeModalProps) {
	const [search, setSearch] = useState('')
	const { userId } = useVirtualStore()
	const [image, setImage] = useState<File | undefined>()
	const initialState = {
		title: '',
		isOfficial: true,
		isFrozen: false,
		isPrivate: false,
		creatorId: userId!,
		description: '',
		type: RecipeTypes.BAKING as RecipeTypes,
	}
	const [recipeInfo, setRecipeInfo] = useState(initialState)

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

	const { mutateAsync, isPending } = useCreateRecipe({
		onSuccess: onCloseModal,
		image,
	})
	return (
		<Modal title={'Создание рецепта'} onCloseModal={onCloseModal}>
			<div style={{ width: '100%' }}>
				<div>
					<PhotoInput image={image} setImage={setImage} />
				</div>
				<div
					style={{
						display: 'flex',
						width: '100%',
						justifyContent: 'space-between',
						gap: '16px',
					}}>
					<div>
						<Input
							value={recipeInfo.title}
							label={'Название'}
							placeholder={'Название рецепта'}
							hasError={!regex.productName.test(recipeInfo.title)}
							errorText={'Допустимы русские буквы и ()'}
							onChange={e =>
								setRecipeInfo(prev => ({
									...prev,
									title: e.target.value,
								}))
							}
							maxLength={60}
						/>
						<Checkbox
							value={recipeInfo.isPrivate}
							label={'Рецепт видят все?'}
							onChange={() =>
								setRecipeInfo(prev => ({
									...prev,
									isPrivate: !prev.isPrivate,
								}))
							}
						/>
						<Select
							label={'Тип рецепта'}
							options={Object.values(RecipeTypes).map(type => ({
								label: type,
								value: type,
							}))}
							value={recipeInfo.type}
							onChange={e =>
								setRecipeInfo(prev => ({
									...prev,
									type: e.target.value as RecipeTypes,
								}))
							}
						/>
					</div>
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
					<Textarea
						label={'Как приготовить'}
						value={recipeInfo.description}
						onChange={e =>
							setRecipeInfo(prev => ({
								...prev,
								description: e.target.value,
							}))
						}
					/>
				</div>
				<div
					style={{
						padding: '15px',
						display: 'flex',
						gap: '8px',
						justifyContent: 'center',
					}}>
					<Button
						disabled={
							!recipeInfo.title ||
							isPending ||
							!regex.productName.test(recipeInfo.title)
						}
						text={'Сохранить'}
						action={async () =>
							mutateAsync({
								info: recipeInfo,
								composition: [...selectedProducts.values()].map(
									product => ({
										productId: product.id,
										quantity: product.quantity,
									})
								),
							})
						}
					/>
					<Button
						text={'Отмена'}
						style={{ borderColor: 'orangered' }}
						action={() => setRecipeInfo(initialState)}
					/>
				</div>
			</div>
		</Modal>
	)
}

interface ICreateRecipeModalProps {
	onCloseModal: () => void
}
