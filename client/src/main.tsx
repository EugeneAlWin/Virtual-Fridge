import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import queryClient from './query/queryClient.ts'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { browserRouter } from './router/browserRouter.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} />
			<RouterProvider router={browserRouter} />
		</QueryClientProvider>
	</React.StrictMode>
)
