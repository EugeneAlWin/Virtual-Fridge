import fridgeIco from '@client/assets/fridge.svg'
import listIco from '@client/assets/list.svg'
import productsIco from '@client/assets/products.svg'
import recipeIco from '@client/assets/recipe.svg'
import { useLogout } from '@client/queries/auth/useLogout'
import useVirtualStore from '@client/storage'
import { Roles } from '@prisma/client'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import s from './navbar.module.scss'

export function NavBar() {
	const { role, userId, deviceId, login } = useVirtualStore()
	const navigate = useNavigate()

	const { mutateAsync: logout } = useLogout()

	if (!role) return <Navigate to={'/auth'} />
	return (
		<div className={s.container}>
			<div className={s.upperContainer}>
				<h1 className={s.bunker}>Холодильник</h1>
				<div className={s.linksContainer}>
					{role === Roles.DEFAULT ? (
						<UserNav />
					) : (
						<GodsNav isAdmin={role === Roles.GOD} />
					)}
				</div>
			</div>
			<div className={s.lowerContainer}>
				<div className={s.accountContainer}>
					<div className={s.imageContainer}>
						{login?.[0].toUpperCase() || ''}
					</div>
					<h3>{login}</h3>
					{role !== Roles.DEFAULT && (
						<h5>
							{role === Roles.ADMIN ? 'Модератор' : 'Администратор'}
						</h5>
					)}
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

function UserNav() {
	return (
		<>
			<LinkElement
				linkTo={'/user/storage'}
				ico={fridgeIco}
				text={'Хранилище'}
			/>
			<LinkElement
				linkTo={'/user/checklists'}
				ico={listIco}
				text={'Списки покупок'}
			/>
			<LinkElement
				linkTo={'/user/recipes'}
				ico={recipeIco}
				text={'Рецепты'}
			/>
			<LinkElement
				linkTo={'/user/products'}
				ico={productsIco}
				text={'Продукты'}
			/>
		</>
	)
}

function GodsNav({ isAdmin }: { isAdmin: boolean }) {
	return (
		<>
			{isAdmin && (
				<LinkElement
					linkTo={'/user/storage'}
					ico={fridgeIco}
					text={'Пользователи'}
				/>
			)}
			<LinkElement
				linkTo={'/user/recipes'}
				ico={recipeIco}
				text={'Рецепты'}
			/>
			<LinkElement
				linkTo={'/user/products'}
				ico={productsIco}
				text={'Продукты'}
			/>
		</>
	)
}

function LinkElement(props: ILinkElementProps) {
	const { pathname } = useLocation()
	return (
		<span
			className={`${s.linkContainer} ${pathname === props.linkTo && s.activeLink}`}>
			<img src={props.ico} alt='' height={28} className={s.listIco} />
			<Link className={s.link} to={props.linkTo}>
				{props.text}
			</Link>
		</span>
	)
}

interface ILinkElementProps {
	ico: string
	linkTo: string
	text: string
}
