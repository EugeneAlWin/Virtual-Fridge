import { Search } from '@client/components/Search'
import { useGetAllProducts } from '@client/queries/products/useGetAllProducts'
import { Units } from '@prisma/client'
import { Dispatch, SetStateAction } from 'react'
import s from './productsDropdown.module.scss'

export default function ProductsDropdown({
	search,
	onChange,
	setMap,
}: IProductsDropdownProps) {
	const { data: productsList } = useGetAllProducts({
		title: search,
		enabled: !!search,
	})
	const products = productsList?.pages.map(page => page.products).flat()

	return (
		<div className={s.container}>
			<h2>Продукты</h2>
			<Search search={search} onChange={onChange} />
			<div>
				{!!products?.length && (
					<div className={s.productsContainer}>
						{products?.map(product => (
							<div
								key={product.id}
								className={s.productElement}
								onClick={() =>
									setMap(
										prev =>
											new Map(
												prev.set(product.title, {
													...product,
													quantity: 0,
												})
											)
									)
								}>
								<p>{product.title}</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

interface IProductsDropdownProps {
	search: string
	onChange: Dispatch<SetStateAction<string>>
	setMap: Dispatch<
		SetStateAction<
			Map<
				string,
				{
					id: string
					creatorId: string | null
					title: string
					unit: Units
					quantity: number
				}
			>
		>
	>
}
