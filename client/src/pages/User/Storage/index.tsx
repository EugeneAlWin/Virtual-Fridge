import Header from '@client/components/Header'
import ProductCard from '@client/components/ProductCard'
import { Search } from '@client/components/Search'
import { useGetStorageComposition } from '@client/queries/storages/useGetStorageComposition'
import { useGetStorageInfo } from '@client/queries/storages/useGetStorageInfo'
import useVirtualStore from '@client/storage'
import { Units } from '@prisma/client'
import { lazy, Suspense, useState } from 'react'

const UpdateProductModal = lazy(
	() => import('@client/modals/products/UpdateProductModal')
)
const AddProductToStorageModal = lazy(
	() => import('@client/modals/products/AddProductToStorageModal')
)
export default function StorageUserPage() {
	const [search, setSearch] = useState('')
	const { userId } = useVirtualStore()
	const [productToEdit, setProductToEdit] = useState<{
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
	}>()
	const [updateProductModalOpen, setUpdateProductModalOpen] = useState(false)
	const [productToAdd, setProductToAdd] = useState<{
		productId: string
		title: string
		expireDate?: Date | null | undefined
		unit: Units
		quantity: number
	}>()
	const { data: storageInfo } = useGetStorageInfo(userId)
	const { data: productsList } = useGetStorageComposition(storageInfo?.id)
	const [addToStorageModalOpen, setAddToStorageModalOpen] = useState(false)

	const products = productsList?.pages
		.map(page => page.composition)
		.flat()
		.filter(product =>
			product?.product.title.toLowerCase().includes(search.toLowerCase())
		)
	return (
		<>
			<Header title={'Хранилище'}>
				<Search search={search} onChange={setSearch} />
			</Header>
			<div
				style={{
					flexWrap: 'wrap',
					display: 'flex',
					minHeight: '100vh',
				}}>
				{products?.map(composition => (
					<ProductCard
						inStoreInfo={{
							unit: composition.product.unit,
							quantity: composition.productQuantity,
						}}
						onAddToStoragePress={() => {
							setProductToAdd({
								title: composition.product.title,
								productId: composition.product.id,
								unit: composition.product.unit,
								quantity: composition.productQuantity,
							})
							setAddToStorageModalOpen(true)
						}}
						onEditPress={() => {
							setProductToEdit(composition.product)
							setUpdateProductModalOpen(true)
						}}
						productInfo={composition.product}
						key={composition.productId}
					/>
				))}
			</div>
			{addToStorageModalOpen && productToAdd && (
				<Suspense fallback={<div>Loading...</div>}>
					<AddProductToStorageModal
						onCloseModal={() => setAddToStorageModalOpen(false)}
						productInfo={productToAdd}
					/>
				</Suspense>
			)}
			{updateProductModalOpen && productToEdit && (
				<Suspense fallback={<div>Loading...</div>}>
					<UpdateProductModal
						initialState={productToEdit}
						onCloseModal={() => setUpdateProductModalOpen(false)}
					/>
				</Suspense>
			)}
		</>
	)
}
