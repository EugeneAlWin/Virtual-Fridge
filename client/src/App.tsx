import './App.css'
import { NavBar } from '@client/components/NavBar'
import { ProductsPage } from '@client/pages/AdminPanel/productsPage/ProductsPage'
import { Navigate } from 'react-router-dom'
import useVirtualStore from './storage'

function App() {
	const { checkStorageHealth } = useVirtualStore()

	if (!checkStorageHealth()) return <Navigate to={'/auth'} />
	return (
		<>
			<NavBar />
			{/*<Outlet />*/}
			<ProductsPage />
		</>
	)
}

export default App
