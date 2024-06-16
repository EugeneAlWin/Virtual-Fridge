import Button from '@client/components/Button'
import { Checkbox } from '@client/components/Checkbox'
import { Input } from '@client/components/Input'
import Modal from '@client/components/Modal'
import Select from '@client/components/Select'
import { useUpdateUser } from '@client/queries/users/useUpdateUser'
import { rolesConverter } from '@client/utils/converters/roles'
import { useState } from 'react'
import { Roles } from '~shared/enums'

export default function UpdateUserModal({
	onCloseModal,
	initialState,
}: IUpdateProductModalProps) {
	const [userInfo, setUserInfo] = useState(initialState)

	const { mutateAsync } = useUpdateUser({
		onSuccess: onCloseModal,
	})

	return (
		<Modal title={'Редактирование пользователя'} onCloseModal={onCloseModal}>
			<div style={{ width: '100%' }}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						width: '100%',
						justifyContent: 'space-around',
					}}>
					<div>
						<Input
							value={userInfo.login}
							label={'Название'}
							placeholder={'Введите логин'}
							onChange={e =>
								setUserInfo(prev => ({
									...prev,
									login: e.target.value,
								}))
							}
							maxLength={60}
						/>
						<Input
							value={userInfo.password || null}
							label={'Пароль'}
							type={'password'}
							placeholder={'Введите пароль'}
							onChange={e =>
								setUserInfo(prev => ({
									...prev,
									password: e.target.value,
								}))
							}
						/>
					</div>
					<div>
						<Checkbox
							value={userInfo.isFrozen ?? false}
							label={'Архивировать пользователя'}
							onChange={() =>
								setUserInfo(prev => ({
									...prev,
									isFrozen: !prev.isFrozen,
								}))
							}
						/>
						<Select
							label={'Роль'}
							options={Object.values(Roles).map(role => ({
								label: rolesConverter[role],
								value: role,
							}))}
							value={userInfo.role}
							onChange={e =>
								setUserInfo(prev => ({
									...prev,
									role: e.target.value as Roles,
								}))
							}
						/>
					</div>
				</div>
				<div
					style={{
						padding: '15px',
						display: 'flex',
						gap: '8px',
						justifyContent: 'center',
					}}>
					{/*TODO*/}
					<Button
						text={'Сохранить'}
						action={async () => {
							await mutateAsync({
								password: undefined,
								isBlocked: undefined,
								isFrozen: userInfo.isFrozen ?? undefined,
								id: userInfo.id,
								login: userInfo.login,
							})
						}}
					/>
					<Button
						text={'Отмена'}
						style={{ borderColor: 'orangered' }}
						action={onCloseModal}
					/>
				</div>
			</div>
		</Modal>
	)
}

interface IUpdateProductModalProps {
	onCloseModal: () => void
	initialState: {
		id: string
		login: string
		password: string
		role: Roles
		createdAt: Date
		isFrozen: boolean | null
		isBlocked: boolean | null
	}
}
