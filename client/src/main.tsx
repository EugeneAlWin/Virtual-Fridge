import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import queryClient from './query/queryClient.ts'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ProductsPage } from './pages/adminPanel/productsPage/ProductsPage.tsx'
import { RecipesPage } from './pages/adminPanel/recipesPage/RecipesPage.tsx'
import App from './App.tsx'
import { UserRecipesPage } from './pages/userPanel/recipesPage/RecipesPage.tsx'
import { UserStorePage } from './pages/userPanel/storePage/StorePage.tsx'
import { UserChecklistsPage } from './pages/userPanel/checklistsPage/ChecklistsPage.tsx'
import { UserChecklistPage } from './pages/userPanel/checklistPage/ChecklistPage.tsx'
import { AuthPage } from './pages/authPage/AuthPage.tsx'
import { RequireAuth } from './components/requireAuth/RequireAuth.tsx'
import { UsersPage } from './pages/adminPanel/usersPage/UsersPage.tsx'

const router = createBrowserRouter([
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

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} />
			<RouterProvider router={router} />
		</QueryClientProvider>
	</React.StrictMode>
)
