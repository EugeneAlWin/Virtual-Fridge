import Button from '@client/components/Button'
import Header from '@client/components/Header'
import RecipeCard from '@client/components/RecipeCard'
import { Search } from '@client/components/Search'
import { useGetAllRecipes } from '@client/queries/recipes/useGetAllRecipes'
import { RecipeTypes, Units } from '@prisma/client'
import { lazy, Suspense, useState } from 'react'

const CreateRecipeModal = lazy(
	() => import('@client/modals/recipes/CreateRecipeModal')
)
const UpdateRecipeModal = lazy(
	() => import('@client/modals/recipes/UpdateRecipeModal')
)

export default function RecipesUserPage() {
	const [search, setSearch] = useState('')
	const [createRecipeModalOpen, setCreateRecipeModalOpen] = useState(false)
	const [updateRecipeModalOpen, setUpdateRecipeModalOpen] = useState(false)
	const [selectedRecipeToEdit, setSelectedRecipeToEdit] = useState<{
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
	}>()
	const { data: recipesList } = useGetAllRecipes({})
	const recipes = recipesList?.pages.map(page => page.recipes).flat()
	return (
		<>
			<Header title={'Рецепты'}>
				<Button
					text={'Создать рецепт'}
					action={() => setCreateRecipeModalOpen(true)}
				/>
				<Search search={search} onChange={setSearch} />
			</Header>
			<div
				style={{
					flexWrap: 'wrap',
					display: 'flex',
				}}>
				{recipes?.map(recipe => (
					<RecipeCard
						// onAddToStoragePress={() => {
						// 	setProductToAdd({
						// 		title: recipe.title,
						// 		productId: recipe.id,
						// 		unit: recipe.unit,
						// 	})
						// 	setAddToStorageModalOpen(true)
						// }}
						onEditPress={() => {
							setSelectedRecipeToEdit({
								isFrozen: recipe.isFrozen,
								title: recipe.title,
								type: recipe.type,
								description: recipe.description || '',
								isOfficial: recipe.isOfficial,
								isPrivate: recipe.isPrivate,
								creatorId: recipe.creatorId,
								id: recipe.id,
								composition: recipe.RecipeComposition,
							})
							setUpdateRecipeModalOpen(true)
						}}
						recipeInfo={recipe}
						key={recipe.id}
					/>
				))}
			</div>
			{createRecipeModalOpen && (
				<Suspense fallback={<div>Loading...</div>}>
					<CreateRecipeModal
						onCloseModal={() => setCreateRecipeModalOpen(false)}
					/>
				</Suspense>
			)}
			{updateRecipeModalOpen && selectedRecipeToEdit && (
				<Suspense fallback={<div>Loading...</div>}>
					<UpdateRecipeModal
						initialState={selectedRecipeToEdit}
						onCloseModal={() => setUpdateRecipeModalOpen(false)}
					/>
				</Suspense>
			)}
		</>
	)
}
