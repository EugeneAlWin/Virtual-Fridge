import Button from '@client/components/Button'
import Modal from '@client/components/Modal'
import { useCreateChecklist } from '@client/queries/checklists/useCreateCheckList'
import useVirtualStore from '@client/storage'

export default function AddToChecklistModal({
	onCloseModal,
	recipesId,
}: ICreateRecipeModalProps) {
	const { userId } = useVirtualStore()

	const { mutateAsync } = useCreateChecklist({
		onSuccess: onCloseModal,
	})
	return (
		<Modal title={'Создать список покупок'} onCloseModal={onCloseModal}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '16px',
					justifyContent: 'center',
				}}>
				<Button
					text={'C учетом продуктов в холодильнике'}
					action={async () =>
						mutateAsync({
							recipesId: recipesId,
							userId: userId!,
							subtractStorage: true,
						})
					}
				/>
				<Button
					text={'Без учета продуктов в холодильнике'}
					action={async () =>
						await mutateAsync({
							recipesId: recipesId,
							userId: userId!,
							subtractStorage: false,
						})
					}
				/>
			</div>
		</Modal>
	)
}

interface ICreateRecipeModalProps {
	onCloseModal: () => void
	recipesId: string[]
}
