import Button from '@client/components/Button'
import { Roles } from '~shared/enums'
import s from './userCard.module.scss'

export default function UserCard({
	userInfo,
	onEditPress,
	onArchivePress,
}: IUserCardProps) {
	return (
		<div>
			<div className={s.container}>
				<div className={s.imageContainer}>
					<h2 className={s.image}>{userInfo.login[0].toUpperCase()}</h2>
				</div>
				<div style={{ padding: '4px' }}>
					<h2 style={{ color: 'white', padding: '4px' }}>
						{userInfo.login}
					</h2>
					<h4>
						Дата регистрации:{' '}
						{new Date(userInfo.createdAt).toLocaleDateString()}
					</h4>
				</div>
				<div className={s.controls}>
					<Button
						text={'Редактировать пользователя'}
						action={onEditPress}
					/>
					<Button
						text={
							userInfo.isFrozen
								? 'Убрать из архива'
								: 'Архивировать пользователя'
						}
						style={{ borderColor: 'orangered' }}
						action={onArchivePress}
					/>
				</div>
			</div>
		</div>
	)
}

interface IUserCardProps {
	onEditPress: () => void
	onArchivePress: () => void
	userInfo: {
		id: string
		login: string
		password: string
		role: Roles
		createdAt: Date
		isFrozen: boolean | null
		isBlocked: boolean | null
	}
}
