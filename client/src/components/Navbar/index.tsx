import fridgeIco from '@client/assets/fridge.svg'
import listIco from '@client/assets/list.svg'
import productsIco from '@client/assets/products.svg'
import recipeIco from '@client/assets/recipe.svg'
import { useLogout } from '@client/queries/auth/useLogout'
import useVirtualStore from '@client/storage'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import s from './navbar.module.scss'

export function NavBar() {
	const { role, userId, deviceId, login } = useVirtualStore()
	const navigate = useNavigate()
	const location = useLocation()
	const pathname = location.pathname

	const { mutateAsync: logout } = useLogout()

	if (!role) return <Navigate to={'/auth'} />
	return (
		<div className={s.container}>
			<div className={s.upperContainer}>
				<h1 className={s.bunker}>Холодильник</h1>
				<div className={s.linksContainer}>
					<span
						className={`${s.linkContainer} ${pathname === '/user/storage' && s.activeLink}`}>
						<img
							src={fridgeIco}
							alt=''
							height={28}
							className={s.listIco}
						/>
						<Link className={s.link} to='/user/storage'>
							Хранилище
						</Link>
					</span>
					<span
						className={`${s.linkContainer} ${pathname === '/user/checklists' && s.activeLink}`}>
						<img src={listIco} alt='' height={28} className={s.listIco} />
						<Link className={s.link} to='/user/checklists'>
							Списки покупок
						</Link>
					</span>
					<span
						className={`${s.linkContainer} ${pathname === '/user/recipes' && s.activeLink}`}>
						<img
							src={recipeIco}
							alt=''
							color={'white'}
							height={28}
							className={s.listIco}
						/>
						<Link className={s.link} to='/user/recipes'>
							Рецепты
						</Link>
					</span>
					<span
						className={`${s.linkContainer} ${pathname === '/user/products' && s.activeLink}`}>
						<img
							src={productsIco}
							alt=''
							height={28}
							className={s.listIco}
						/>
						<Link className={s.link} to='/user/products'>
							Продукты
						</Link>
					</span>
				</div>
			</div>
			<div className={s.lowerContainer}>
				<div className={s.accountContainer}>
					<div className={s.imageContainer}>
						{login?.[0].toUpperCase() || ''}
					</div>
					<h3>{login}</h3>
				</div>
				<button
					type={'button'}
					className={s.logoutButton}
					onClick={async () => {
						if (!userId || !deviceId) return
						await logout({ userId, deviceId })
						localStorage.clear()
						navigate('/auth')
					}}>
					Выйти
				</button>
			</div>
		</div>
	)
}
