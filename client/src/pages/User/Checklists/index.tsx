import ChecklistCard from '@client/components/ChecklistCard'
import Header from '@client/components/Header'
import { useConfirmChecklist } from '@client/queries/checklists/useConfirmChecklist'
import { useUpdateChecklist } from '@client/queries/checklists/useDropChecklist'
import { useGetAllChecklists } from '@client/queries/checklists/useGetAllChecklists'
import useVirtualStore from '@client/storage'
import { Decimal } from '@prisma/client/runtime/library'
import { lazy, Suspense, useState } from 'react'
import { Currencies, Units } from '~shared/enums'

const ShowFullChecklistModal = lazy(
	() => import('@client/modals/checklists/ShowFullChecklistModal')
)
const UpdateChecklistModal = lazy(
	() => import('@client/modals/checklists/UpdateChecklistModal')
)

export default function ChecklistsUserPage() {
	const { userId } = useVirtualStore()
	const [updateChecklistModalOpen, setUpdateChecklistModalOpen] =
		useState(false)
	const [showFullChecklistModalOpen, setShowFullChecklistModalOpen] =
		useState(false)
	const [selectedChecklist, setSelectedChecklist] = useState<{
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
	}>()
	const { data: checkListPages } = useGetAllChecklists({})
	const checklists = checkListPages?.pages.map(page => page.lists).flat()

	const { mutateAsync: dropChecklist } = useUpdateChecklist({})
	const { mutateAsync } = useConfirmChecklist({})

	return (
		<>
			<Header title={'Списки покупок'}></Header>
			{!checklists?.length && <h1>Пусто</h1>}
			<div
				style={{
					flexWrap: 'wrap',
					display: 'flex',
				}}>
				{checklists?.map(checklist => (
					<ChecklistCard
						onDrop={() => dropChecklist({ checklistId: checklist.id })}
						onConfirm={async () => {
							await mutateAsync({
								userId: userId!,
								checklistId: checklist.id,
							})
						}}
						onShow={() => {
							setSelectedChecklist(checklist)
							setShowFullChecklistModalOpen(true)
						}}
						onEdit={() => {
							setSelectedChecklist(checklist)
							setUpdateChecklistModalOpen(true)
						}}
						checklistInfo={checklist}
						key={checklist.id}
					/>
				))}
			</div>
			{updateChecklistModalOpen && selectedChecklist && (
				<Suspense fallback={<div>Loading...</div>}>
					<UpdateChecklistModal
						checklistInfo={selectedChecklist}
						onCloseModal={() => setUpdateChecklistModalOpen(false)}
					/>
				</Suspense>
			)}
			{showFullChecklistModalOpen && selectedChecklist && (
				<Suspense fallback={<div>Loading...</div>}>
					<ShowFullChecklistModal
						checklistInfo={selectedChecklist}
						onCloseModal={() => setShowFullChecklistModalOpen(false)}
					/>
				</Suspense>
			)}
		</>
	)
}
