import './App.css'
import { Link, Outlet } from 'react-router-dom'

function App() {
	return (
		<>
			<div>
				<Link to='/admin/users'>Users </Link>
				<Link to='/admin/products'>Products </Link>
				<Link to='/admin/recipes'>Recipes</Link>
			</div>
			<Outlet />
		</>
	)
}

export default App
