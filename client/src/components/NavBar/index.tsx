import { useLogout } from '@client/queries/auth/useLogout'
import useVirtualStore from '@client/storage'
import { Roles } from '@prisma/client'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import styles from './navBar.module.scss'

export function NavBar() {
	const { role, userId, deviceId } = useVirtualStore()
	const navigate = useNavigate()

	const { mutateAsync: logout } = useLogout()

	if (!role) return <Navigate to={'/auth'} />
	return (
		<div className={styles.navBarContainer}>
			<div className={styles.linksContainer}>
				{role === Roles.DEFAULT ? (
					<DefaultNavBar />
				) : (
					<AdminNavBar role={role} />
				)}
			</div>
			<button
				className={styles.logout}
				onClick={async () => {
					if (!userId || !deviceId) return
					await logout({ userId, deviceId })
					localStorage.clear()
					navigate('/auth')
				}}>
				Выйти
			</button>
		</div>
	)
}

const DefaultNavBar = () => {
	return (
		<>
			<Link to='/user/recipes'>Рецепты </Link>
			<Link to='/user/store'>Хранилище</Link>
			<Link to='/user/checklists'>Чек-листы</Link>
		</>
	)
}

const AdminNavBar = ({ role }: { role: Exclude<Roles, 'DEFAULT'> }) => {
	return (
		<>
			{role === Roles.ADMIN && <Link to='/admin/users'>Пользователи</Link>}
			<Link to='/admin/products'>Продукты</Link>
			<Link to='/admin/recipes'>Рецепты</Link>
		</>
	)
}
