import { createBrowserRouter } from 'react-router-dom'
import App from '../App.tsx'
import { RequireAuth } from '../components/requireAuth/RequireAuth.tsx'
import { UsersPage } from '../pages/adminPanel/usersPage/UsersPage.tsx'
import { ProductsPage } from '../pages/adminPanel/productsPage/ProductsPage.tsx'
import { RecipesPage } from '../pages/adminPanel/recipesPage/RecipesPage.tsx'
import { UserChecklistsPage } from '../pages/userPanel/checklistsPage/ChecklistsPage.tsx'
import { UserChecklistPage } from '../pages/userPanel/checklistPage/ChecklistPage.tsx'
import { UserRecipesPage } from '../pages/userPanel/recipesPage/RecipesPage.tsx'
import { UserStorePage } from '../pages/userPanel/storePage/StorePage.tsx'
import { AuthPage } from '../pages/authPage/AuthPage.tsx'

export const browserRouter = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				path: 'admin/users/',
				element: (
					<RequireAuth isRootRequire>
						<UsersPage />
					</RequireAuth>
				),
			},
			{
				path: 'admin/products/',
				element: (
					<RequireAuth isRootRequire>
						<ProductsPage />
					</RequireAuth>
				),
			},
			{
				path: 'admin/recipes/',
				element: (
					<RequireAuth isRootRequire>
						<RecipesPage />
					</RequireAuth>
				),
			},
			{
				path: 'user/checklists/',
				element: (
					<RequireAuth>
						<UserChecklistsPage />
					</RequireAuth>
				),
			},
			{
				path: 'user/checklists/:checklistId',
				element: (
					<RequireAuth>
						<UserChecklistPage />
					</RequireAuth>
				),
			},
			{
				path: 'user/recipes/',
				element: (
					<RequireAuth>
						<UserRecipesPage />
					</RequireAuth>
				),
			},
			{
				path: 'user/store/',
				element: (
					<RequireAuth>
						<UserStorePage />
					</RequireAuth>
				),
			},
		],
	},
	{ path: 'auth', element: <AuthPage /> },
])
