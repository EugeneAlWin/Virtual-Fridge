import Button from '@client/components/Button'
import ChecklistCard from '@client/components/ChecklistCard'
import Header from '@client/components/Header'
import { Search } from '@client/components/Search'
import { useConfirmChecklist } from '@client/queries/checklists/useConfirmChecklist'
import { useGetAllChecklists } from '@client/queries/checklists/useGetAllChecklists'
import useVirtualStore from '@client/storage'
import { useState } from 'react'

export default function ChecklistsUserPage() {
	const [search, setSearch] = useState('')
	const { userId } = useVirtualStore()
	// const [createProductModalOpen, setCreateProductModalOpen] = useState(false)

	const { data: checkListPages } = useGetAllChecklists({})
	const checklists = checkListPages?.pages.map(page => page.lists).flat()
	// .filter(product =>
	// 	product.title.toLowerCase().includes(search.toLowerCase())
	// )
	const { mutateAsync } = useConfirmChecklist({})
	return (
		<>
			<Header title={'Списки покупок'}>
				<Button
					text={'Создать список'}
					// action={() => setCreateProductModalOpen(true)}
				/>
				<Search search={search} onChange={setSearch} />
			</Header>

			<div
				style={{
					flexWrap: 'wrap',
					display: 'flex',
				}}>
				{checklists?.map(checklist => (
					<ChecklistCard
						onConfirm={async () => {
							await mutateAsync({
								userId: userId!,
								checklistId: checklist.id,
							})
						}}
						// onEditPress={() => {
						// 	setProductToEdit(checklist)
						// 	setUpdateProductModalOpen(true)
						// }}
						checklistInfo={checklist}
						key={checklist.id}
					/>
				))}
			</div>
			{/*{createProductModalOpen && (*/}
			{/*	<Suspense fallback={<div>Loading...</div>}>*/}
			{/*		<CreateProductModal*/}
			{/*			onCloseModal={() => setCreateProductModalOpen(false)}*/}
			{/*		/>*/}
			{/*	</Suspense>*/}
			{/*)}*/}
			{/*{updateProductModalOpen && productToEdit && (*/}
			{/*	<Suspense fallback={<div>Loading...</div>}>*/}
			{/*		<UpdateProductModal*/}
			{/*			initialState={productToEdit}*/}
			{/*			onCloseModal={() => setUpdateProductModalOpen(false)}*/}
			{/*		/>*/}
			{/*	</Suspense>*/}
			{/*)}*/}
		</>
	)
}
