import fridgeIco from '@client/assets/fridge.svg'
import heartIco from '@client/assets/heart.svg'
import listIco from '@client/assets/list.svg'
import productsIco from '@client/assets/products.svg'
import recipeIco from '@client/assets/recipe.svg'
import starIco from '@client/assets/star.svg'
import usersIco from '@client/assets/users.svg'
import { useLogout } from '@client/queries/auth/useLogout'
import useVirtualStore from '@client/storage'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Roles } from '~shared/enums'
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
						<h5>{role === Roles.ADMIN ? '*' : '**'}</h5>
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
			<LinkElement
				linkTo={'/user/selected'}
				ico={starIco}
				text={'Приготовить'}
			/>
			<LinkElement
				linkTo={'/user/favorite'}
				ico={heartIco}
				text={'Избранное'}
			/>
		</>
	)
}

function GodsNav({ isAdmin }: { isAdmin: boolean }) {
	return (
		<>
			{isAdmin && (
				<LinkElement
					linkTo={'/admin/users'}
					ico={usersIco}
					text={'Пользователи'}
				/>
			)}
			<LinkElement
				linkTo={'/admin/recipes'}
				ico={recipeIco}
				text={'Рецепты'}
			/>
			<LinkElement
				linkTo={'/admin/products'}
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
