import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import queryClient from './query/queryClient.ts'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { UsersPage } from './pages/adminPanel/usersPage/usersPage.tsx'
import { ProductsPage } from './pages/adminPanel/productsPage/productsPage.tsx'
import { RecipesPage } from './pages/adminPanel/recipesPage/recipesPage.tsx'
import App from './App.tsx'

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				path: 'admin/users/',
				element: <UsersPage />,
			},
			{
				path: 'admin/products/',
				element: <ProductsPage />,
			},
			{
				path: 'admin/recipes/',
				element: <RecipesPage />,
			},
		],
	},
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} />
			<RouterProvider router={router} />
		</QueryClientProvider>
	</React.StrictMode>
)
