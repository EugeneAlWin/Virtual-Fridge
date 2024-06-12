import App from '@client/App'
import { RequirePermissions } from '@client/components/RequirePermissions'
import { UsersAdminPage } from '@client/pages/Admin/Users'
import { AuthPage } from '@client/pages/Auth'
import ChecklistsUserPage from '@client/pages/User/Checklists'
import FavoriteRecipesUserPage from '@client/pages/User/FavoriteRecipes'
import ProductsUserPage from '@client/pages/User/Products'
import RecipesUserPage from '@client/pages/User/Recipes'
import SelectedRecipesUserPage from '@client/pages/User/SelectedRecipes'
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
						<UsersAdminPage />
					</RequirePermissions>
				),
			},
			{
				path: 'admin/products/',
				element: (
					<RequirePermissions isRootRequire>
						<ProductsUserPage />
					</RequirePermissions>
				),
			},
			{
				path: 'admin/recipes/',
				element: (
					<RequirePermissions isRootRequire>
						<RecipesUserPage />
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
			{
				path: 'user/selected/',
				element: (
					<RequirePermissions>
						<SelectedRecipesUserPage />
					</RequirePermissions>
				),
			},
			{
				path: 'user/favorite/',
				element: (
					<RequirePermissions>
						<FavoriteRecipesUserPage />
					</RequirePermissions>
				),
			},
		],
	},
	{ path: 'auth', element: <AuthPage /> },
])
