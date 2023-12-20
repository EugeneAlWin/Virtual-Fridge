import './App.css'
import { Navigate, Outlet } from 'react-router-dom'
import useVirtualStore from './storage'
import { NavBar } from './components/navBar/NavBar.tsx'

function App() {
	const { checkStorageHealth } = useVirtualStore()

	if (!checkStorageHealth()) return <Navigate to={'/auth'} />
	return (
		<>
			<NavBar />
			<Outlet />
		</>
	)
}

export default App
