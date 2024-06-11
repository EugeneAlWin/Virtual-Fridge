import App from '@client/App'
import { RequirePermissions } from '@client/components/RequirePermissions'
import { ProductsPage } from '@client/pages/Admin/productsPage/ProductsPage'
import { RecipesPage } from '@client/pages/Admin/recipesPage/RecipesPage'
import { UsersPage } from '@client/pages/Admin/UsersPage'
import { AuthPage } from '@client/pages/Auth'
import { UserChecklistPage } from '@client/pages/User/checklistPage/ChecklistPage'
import ChecklistsUserPage from '@client/pages/User/Checklists'
import ProductsUserPage from '@client/pages/User/Products'
import RecipesUserPage from '@client/pages/User/Recipes'
import StorageUserPage from '@client/pages/User/Storage'
import { createBrowserRouter } from 'react-router-dom'

export const browserRouter = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				path: 'admin/users/',
				element: (
					<RequirePermissions isRootRequire>
						<UsersPage />
					</RequirePermissions>
				),
			},
			{
				path: 'admin/products/',
				element: (
					<RequirePermissions isRootRequire>
						<ProductsPage />
					</RequirePermissions>
				),
			},
			{
				path: 'admin/recipes/',
				element: (
					<RequirePermissions isRootRequire>
						<RecipesPage />
					</RequirePermissions>
				),
			},
			{
				path: 'user/checklists/',
				element: (
					<RequirePermissions>
						<ChecklistsUserPage />
					</RequirePermissions>
				),
			},
			{
				path: 'user/checklists/:checklistId',
				element: (
					<RequirePermissions>
						<UserChecklistPage />
					</RequirePermissions>
				),
			},
			{
				path: 'user/recipes/',
				element: (
					<RequirePermissions>
						<RecipesUserPage />
					</RequirePermissions>
				),
			},
			{
				path: 'user/storage/',
				element: (
					<RequirePermissions>
						<StorageUserPage />
					</RequirePermissions>
				),
			},
			{
				path: 'user/products/',
				element: (
					<RequirePermissions>
						<ProductsUserPage />
					</RequirePermissions>
				),
			},
		],
	},
	{ path: 'auth', element: <AuthPage /> },
])
