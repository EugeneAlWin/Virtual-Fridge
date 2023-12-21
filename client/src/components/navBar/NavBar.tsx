import { Roles } from '../../api/enums.ts'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import useVirtualStore from '../../storage'
import { useLogout } from '../../query/auth/useLogout.ts'
import styles from './navBar.module.scss'

export function NavBar() {
	const { role, userId, deviceId } = useVirtualStore()
	const navigate = useNavigate()

	const { logout } = useLogout()
	return (
		<div className={styles.navBarContainer}>
			<div className={`${styles.cube}`}></div>
			{role === Roles.ADMIN ? (
				<div className={styles.linksContainer}>
					<Link to='/admin/users'>Пользователи</Link>
					<Link to='/admin/products'>Продукты</Link>
					<Link to='/admin/recipes'>Рецепты</Link>
				</div>
			) : role === Roles.DEFAULT ? (
				<div className={styles.linksContainer}>
					<Link to='/user/recipes'>Рецепты </Link>
					<Link to='/user/store'>Хранилище</Link>
					<Link to='/user/checklists'>Чек-листы</Link>
				</div>
			) : (
				<Navigate to={'/auth'} />
			)}
			<button
				className={styles.logout}
				onClick={async () => {
					if (!userId || !deviceId) return
					await logout({ userId: +userId, devicesId: [deviceId] })
					localStorage.clear()
					navigate('/auth')
				}}>
				Logout
			</button>
			<div className={`${styles.cube_reverse}`}></div>
		</div>
	)
}
