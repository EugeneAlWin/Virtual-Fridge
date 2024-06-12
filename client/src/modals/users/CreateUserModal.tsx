import Button from '@client/components/Button'
import { Checkbox } from '@client/components/Checkbox'
import { Input } from '@client/components/Input'
import Modal from '@client/components/Modal'
import Select from '@client/components/Select'
import { useCreateUser } from '@client/queries/users/useCreateUser'
import { rolesConverter } from '@client/utils/converters/roles'
import { Roles } from '@prisma/client'
import { useState } from 'react'

export default function CreateUserModal({
	onCloseModal,
}: IUpdateProductModalProps) {
	const [userInfo, setUserInfo] = useState({
		login: '',
		password: '',
		role: Roles.DEFAULT as Roles,
		isFrozen: false,
	})

	const { mutateAsync } = useCreateUser({
		onSuccess: onCloseModal,
	})

	return (
		<Modal title={'Редактирование продукта'} onCloseModal={onCloseModal}>
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
							await mutateAsync(userInfo)
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
}
