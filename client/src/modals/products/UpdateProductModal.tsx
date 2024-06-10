import Button from '@client/components/Button'
import { Checkbox } from '@client/components/Checkbox'
import { Input } from '@client/components/Input'
import Modal from '@client/components/Modal'
import PhotoInput from '@client/components/PhotoInput'
import Select from '@client/components/Select'
import { useUpdateProduct } from '@client/queries/products/useUpdateProduct'
import { unitsConverter } from '@client/utils/converters/units'
import { regex } from '@client/utils/regex'
import { Units } from '@prisma/client'
import { useState } from 'react'

export default function UpdateProductModal({
	onCloseModal,
	initialState,
}: IUpdateProductModalProps) {
	const [productInfo, setProductInfo] = useState(initialState)
	const [image, setImage] = useState<File | undefined>()

	const { mutateAsync, isPending } = useUpdateProduct({
		onSuccess: onCloseModal,
		image,
	})

	return (
		<Modal title={'Редактирование продукта'} onCloseModal={onCloseModal}>
			<div style={{ width: '100%' }}>
				<div>
					<PhotoInput image={image} setImage={setImage} />
				</div>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						width: '100%',
						justifyContent: 'space-around',
					}}>
					<div>
						<Input
							value={productInfo.title}
							label={'Название'}
							placeholder={'Название продукта'}
							hasError={!regex.productName.test(productInfo.title)}
							errorText={'Допустимы русские буквы и ()'}
							onChange={e =>
								setProductInfo(prev => ({
									...prev,
									title: e.target.value,
								}))
							}
							maxLength={60}
						/>
						<Input
							value={productInfo.protein || null}
							label={'Белки'}
							type={'number'}
							placeholder={'Количество белка'}
							onChange={e =>
								setProductInfo(prev => ({
									...prev,
									protein: +e.target.value,
								}))
							}
						/>
						<Input
							value={productInfo.fats || null}
							label={'Жиры'}
							placeholder={'Количество жира'}
							type={'number'}
							onChange={e =>
								setProductInfo(prev => ({
									...prev,
									fats: +e.target.value,
								}))
							}
						/>
					</div>
					<div>
						<Input
							value={productInfo.carbohydrates || null}
							label={'Углеводы'}
							type={'number'}
							placeholder={'Количество углеводов'}
							onChange={e =>
								setProductInfo(prev => ({
									...prev,
									carbohydrates: +e.target.value,
								}))
							}
						/>
						<Input
							value={productInfo.calories || null}
							label={'Калории'}
							placeholder={'Количество калорий'}
							type={'number'}
							onChange={e =>
								setProductInfo(prev => ({
									...prev,
									calories: +e.target.value,
								}))
							}
						/>
						<Input
							value={productInfo.averageShelfLifeInDays || null}
							placeholder={'Количество дней'}
							type={'number'}
							label={'Средний срок годности (дней)'}
							onChange={e =>
								setProductInfo(prev => ({
									...prev,
									averageShelfLifeInDays: +e.target.value,
								}))
							}
						/>
					</div>
					<div>
						<Checkbox
							value={productInfo.isOfficial}
							label={'Продукт видят все?'}
							onChange={() =>
								setProductInfo(prev => ({
									...prev,
									isOfficial: !prev.isOfficial,
								}))
							}
						/>
						<Checkbox
							value={productInfo.isRecipePossible}
							label={'Базовый продукт?'}
							onChange={() =>
								setProductInfo(prev => ({
									...prev,
									isRecipePossible: !prev.isRecipePossible,
								}))
							}
						/>
						<Select
							label={'Единицы измерения'}
							options={Object.values(Units).map(unit => ({
								label: unitsConverter[unit],
								value: unit,
							}))}
							value={productInfo.unit}
							onChange={e =>
								setProductInfo(prev => ({
									...prev,
									unit: e.target.value as Units,
								}))
							}
						/>
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
						disabled={
							!productInfo.title ||
							isPending ||
							!regex.productName.test(productInfo.title)
						}
						text={'Сохранить'}
						action={async () => {
							await mutateAsync({
								title:
									productInfo.title === initialState.title
										? undefined
										: productInfo.title,
								fats: productInfo.fats ?? undefined,
								calories: productInfo.calories ?? undefined,
								protein: productInfo.protein ?? undefined,
								carbohydrates: productInfo.carbohydrates ?? undefined,
								isFrozen: productInfo.isFrozen ?? undefined,
								id: productInfo.id,
								averageShelfLifeInDays:
									productInfo.averageShelfLifeInDays ?? undefined,
								unit: productInfo.unit ?? undefined,
								isRecipePossible:
									productInfo.isRecipePossible ?? undefined,
							})
						}}
					/>
					<Button
						text={'Отмена'}
						style={{ borderColor: 'orangered' }}
						action={() => setProductInfo(initialState)}
					/>
				</div>
			</div>
		</Modal>
	)
}

interface IUpdateProductModalProps {
	onCloseModal: () => void
	initialState: {
		id: string
		creatorId: string | null
		title: string
		calories: number
		protein: number
		fats: number
		carbohydrates: number
		unit: Units
		isOfficial: boolean
		isFrozen: boolean
		isRecipePossible: boolean
		averageShelfLifeInDays: number | null
	}
}
