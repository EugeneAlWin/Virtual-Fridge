import './App.css'
import { NavBar } from '@client/components/Navbar'
import useVirtualStore from '@client/storage'
import { Navigate, Outlet } from 'react-router-dom'

function App() {
	const { checkStorageHealth } = useVirtualStore()

	if (!checkStorageHealth()) return <Navigate to={'/auth'} />
	return (
		<div className={'main'}>
			<NavBar />
			<div style={{ width: '100%', marginLeft: '300px', padding: '0 40px' }}>
				<Outlet />
			</div>
		</div>
	)
}

export default App
