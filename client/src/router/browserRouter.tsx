import App from '@client/App'
import { AuthPage } from '@client/pages/authPage/AuthPage'
import { createBrowserRouter } from 'react-router-dom'

export const browserRouter = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		// children: [
		// 	{
		// 		path: 'admin/users/',
		// 		element: (
		// 			<RequirePermissions isRootRequire>
		// 				<UsersPage />
		// 			</RequirePermissions>
		// 		),
		// 	},
		// 	{
		// 		path: 'admin/products/',
		// 		element: (
		// 			<RequirePermissions isRootRequire>
		// 				<ProductsPage />
		// 			</RequirePermissions>
		// 		),
		// 	},
		// 	{
		// 		path: 'admin/recipes/',
		// 		element: (
		// 			<RequirePermissions isRootRequire>
		// 				<RecipesPage />
		// 			</RequirePermissions>
		// 		),
		// 	},
		// 	{
		// 		path: 'user/checklists/',
		// 		element: (
		// 			<RequirePermissions>
		// 				<UserChecklistsPage />
		// 			</RequirePermissions>
		// 		),
		// 	},
		// 	{
		// 		path: 'user/checklists/:checklistId',
		// 		element: (
		// 			<RequirePermissions>
		// 				<UserChecklistPage />
		// 			</RequirePermissions>
		// 		),
		// 	},
		// 	{
		// 		path: 'user/recipes/',
		// 		element: (
		// 			<RequirePermissions>
		// 				<UserRecipesPage />
		// 			</RequirePermissions>
		// 		),
		// 	},
		// 	{
		// 		path: 'user/store/',
		// 		element: (
		// 			<RequirePermissions>
		// 				<UserStorePage />
		// 			</RequirePermissions>
		// 		),
		// 	},
		// ],
	},
	{ path: 'auth', element: <AuthPage /> },
])
