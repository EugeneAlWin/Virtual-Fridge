import Button from '@client/components/Button'
import { Input } from '@client/components/Input'
import Modal from '@client/components/Modal'
import { useAddProductToStorage } from '@client/queries/storages/useAddProductToStorage'
import useVirtualStore from '@client/storage'
import { useState } from 'react'
import { Units } from '~shared/enums'

export default function AddProductToStorageModal({
	onCloseModal,
	productInfo,
}: IAddProductToStorageModalProps) {
	const [quantity, setQuantity] = useState(productInfo.quantity ?? 0)
	const { storageId } = useVirtualStore()
	const { mutateAsync } = useAddProductToStorage({ onSuccess: onCloseModal })
	return (
		<Modal title={'Добавить в холодильник'} onCloseModal={onCloseModal}>
			<h2>{productInfo.title}</h2>
			<div>
				<Input
					type={'number'}
					label={'Количество'}
					onChange={e => setQuantity(+e.target.value)}
					value={quantity}
					placeholder={'Введите кол-во продукта'}
				/>
				<Button
					text={'Добавить'}
					action={async () => {
						await mutateAsync({
							productId: productInfo.productId,
							productQuantity: quantity,
							storageId: storageId!,
						})
					}}
				/>
			</div>
		</Modal>
	)
}

interface IAddProductToStorageModalProps {
	productInfo: {
		productId: string
		title: string
		expireDate?: Date | null
		unit: Units
		quantity?: number
	}
	onCloseModal: () => void
}
