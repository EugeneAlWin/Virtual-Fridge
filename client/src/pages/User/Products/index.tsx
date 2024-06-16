import Button from '@client/components/Button'
import Header from '@client/components/Header'
import ProductCard from '@client/components/ProductCard'
import { Search } from '@client/components/Search'
import { useDropProduct } from '@client/queries/products/useDropProduct'
import { useGetAllProducts } from '@client/queries/products/useGetAllProducts'
import { lazy, Suspense, useState } from 'react'
import { Units } from '~shared/enums'

const CreateProductModal = lazy(
	() => import('@client/modals/products/CreateProductModal')
)
const UpdateProductModal = lazy(
	() => import('@client/modals/products/UpdateProductModal')
)
const AddProductToStorageModal = lazy(
	() => import('@client/modals/products/AddProductToStorageModal')
)

export default function ProductsUserPage() {
	const [search, setSearch] = useState('')
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
	const [productToAdd, setProductToAdd] = useState<{
		productId: string
		title: string
		expireDate?: Date | null | undefined
		unit: Units
	}>()
	const [createProductModalOpen, setCreateProductModalOpen] = useState(false)
	const [updateProductModalOpen, setUpdateProductModalOpen] = useState(false)
	const [addToStorageModalOpen, setAddToStorageModalOpen] = useState(false)

	const { data: productsList } = useGetAllProducts({})
	const products = productsList?.pages
		.map(page => page.products)
		.flat()
		.filter(product =>
			product.title.toLowerCase().includes(search.toLowerCase())
		)

	const { mutateAsync } = useDropProduct({})

	return (
		<>
			<Header title={'Продукты'}>
				<Button
					text={'Создать продукт'}
					action={() => setCreateProductModalOpen(true)}
				/>
				<Search search={search} onChange={setSearch} />
			</Header>
			{!products?.length && <h1>Пусто</h1>}
			<div
				style={{
					flexWrap: 'wrap',
					display: 'flex',
				}}>
				{products?.map(product => (
					<ProductCard
						onAddToStoragePress={() => {
							setProductToAdd({
								title: product.title,
								productId: product.id,
								unit: product.unit,
							})
							setAddToStorageModalOpen(true)
						}}
						onEditPress={() => {
							setProductToEdit(product)
							setUpdateProductModalOpen(true)
						}}
						onDropPress={() => mutateAsync(product.id)}
						productInfo={product}
						key={product.id}
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
			{createProductModalOpen && (
				<Suspense fallback={<div>Loading...</div>}>
					<CreateProductModal
						onCloseModal={() => setCreateProductModalOpen(false)}
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
