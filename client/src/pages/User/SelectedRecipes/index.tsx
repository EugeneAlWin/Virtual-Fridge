import Button from '@client/components/Button'
import Header from '@client/components/Header'
import { Search } from '@client/components/Search'
import SelectedRecipeCard from '@client/components/SelectedRecipeCard'
import { useGetAllSelectedRecipes } from '@client/queries/recipes/useGetAllSelectedRecipes'
import useVirtualStore from '@client/storage'
import { RecipeTypes, Units } from '@prisma/client'
import { lazy, Suspense, useState } from 'react'

const CreateRecipeModal = lazy(
	() => import('@client/modals/recipes/CreateRecipeModal')
)
const UpdateRecipeModal = lazy(
	() => import('@client/modals/recipes/UpdateRecipeModal')
)
const AddToChecklistModal = lazy(
	() => import('@client/modals/recipes/AddToChecklistModal')
)
const ShowFullRecipeModal = lazy(
	() => import('@client/modals/recipes/ShowFullRecipeModal')
)

export default function SelectedRecipesUserPage() {
	const [search, setSearch] = useState('')
	const { userId } = useVirtualStore()

	const [createRecipeModalOpen, setCreateRecipeModalOpen] = useState(false)
	const [showFullRecipeModalOpen, setShowFullRecipeModalOpen] = useState(false)
	const [addToChecklistModalOpen, setAddToChecklistModalOpen] = useState(false)
	const [updateRecipeModalOpen, setUpdateRecipeModalOpen] = useState(false)
	const [selectedRecipes, setSelectedRecipes] = useState<string[]>([])
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
	const { data: recipesList, isLoading } = useGetAllSelectedRecipes({
		userId: userId!,
	})
	const recipes = recipesList?.pages
		.map(page => page.recipes)
		.flat()
		.filter(i => i.recipe.title?.toLowerCase().includes(search.toLowerCase()))
	if (isLoading) return <div>Loading</div>
	return (
		<>
			<Header title={'Приготовить...'}>
				{selectedRecipes.length > 0 && (
					<Button
						text={'Создать список покупок'}
						action={() => setAddToChecklistModalOpen(true)}
					/>
				)}
				<Button
					text={'Создать рецепт'}
					action={() => setCreateRecipeModalOpen(true)}
				/>
				<Search search={search} onChange={setSearch} />
			</Header>
			{!recipes?.length && <h1>Пусто</h1>}
			<div
				style={{
					flexWrap: 'wrap',
					display: 'flex',
				}}>
				{recipes?.map(recipe2 => {
					const recipe = recipe2.recipe
					return (
						<SelectedRecipeCard
							onSelect={() => {
								setSelectedRecipes(prev =>
									selectedRecipes.find(id => id === recipe.id)
										? [...prev.filter(id => id !== recipe.id)]
										: [...prev, recipe.id]
								)
							}}
							onShowFullRecipe={() => {
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
								setShowFullRecipeModalOpen(true)
							}}
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
					)
				})}
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
			{showFullRecipeModalOpen && selectedRecipeToEdit && (
				<Suspense fallback={<div>Loading...</div>}>
					<ShowFullRecipeModal
						recipeInfo={selectedRecipeToEdit}
						onCloseModal={() => setShowFullRecipeModalOpen(false)}
					/>
				</Suspense>
			)}
			{addToChecklistModalOpen && selectedRecipes && (
				<Suspense fallback={<div>Loading...</div>}>
					<AddToChecklistModal
						recipesId={selectedRecipes}
						onCloseModal={() => setAddToChecklistModalOpen(false)}
					/>
				</Suspense>
			)}
		</>
	)
}
