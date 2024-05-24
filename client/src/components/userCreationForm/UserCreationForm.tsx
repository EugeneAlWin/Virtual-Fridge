import { useCreateUser } from '@client/queries/users/useCreateUser'
import {
	SelectedUser,
	useUpdateUser,
} from '@client/queries/users/useUpdateUser'
import { Roles } from '@prisma/client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './userCreationForm.module.scss'

interface UserCreationFormProps {
	selectedUser: SelectedUser
	setSelectedUser: Dispatch<SetStateAction<SelectedUser>>
}

export function UserCreationForm({
	selectedUser,
	setSelectedUser,
}: UserCreationFormProps) {
	const [validData, setValidData] = useState({ login: true, password: true })

	const {
		mutateAsync: updateUser,
		isError: isUpdateError,
		isSuccess,
	} = useUpdateUser()

	useEffect(() => {
		if (isUpdateError)
			toast('Ошибка обновления пользователя!', {
				type: 'error',
				theme: 'dark',
			})
		if (isSuccess)
			toast('Обновлено успешно!', {
				type: 'error',
				theme: 'dark',
			})
	}, [isUpdateError, isSuccess])
	return (
		<div className={styles.modal}>
			{selectedUser ? (
				<>
					<h3>Редактирование пользователя</h3>
					<div className={styles.div}>
						<p>Логин</p>
						<input
							type='text'
							value={selectedUser.login}
							className={`${styles.input} ${!validData.login ? styles.error : ''}`}
							maxLength={30}
							title={
								'Логин должен содержать 4-30 латинских символов. ' +
								'Можно использовать числа'
							}
							onChange={e => {
								setValidData(prev => ({
									...prev,
									login: /^[a-zA-Z0-9]{4,30}$/.test(e.target.value),
								}))
								setSelectedUser(prev => ({
									...prev,
									login: e.target.value,
								}))
							}}
						/>
					</div>
					<div className={styles.div}>
						<p>Пароль</p>
						<input
							value={selectedUser.password}
							type='password'
							className={`${styles.input} ${
								!validData.password ? styles.error : ''
							}`}
							maxLength={120}
							title={
								'Пароль должен содержать 8-120 латинских символов, включать символы ' +
								'!@#$%^&*, иметь Хотя бы одну заглавную букву'
							}
							onChange={e => {
								setValidData(prev => ({
									...prev,
									password:
										/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,120}/g.test(
											e.target.value
										),
								}))
								setSelectedUser(prev => ({
									...prev,
									password: e.target.value,
								}))
							}}
						/>
					</div>
					<div className={styles.div}>
						<p>Удален</p>
						<input
							className={styles.checkbox}
							type='checkbox'
							checked={selectedUser.isFrozen}
							onChange={e =>
								setSelectedUser(prev => ({
									...prev,
									isFrozen: e.target.checked,
								}))
							}
						/>
					</div>
					<div>
						<button
							disabled={
								!selectedUser.id ||
								!validData.login ||
								!validData.password ||
								selectedUser.login === ''
							}
							onClick={async () => {
								await updateUser(selectedUser)
								setSelectedUser(null)
							}}>
							Сохранить
						</button>
						<button onClick={() => setSelectedUser(null)}>
							Отменить
						</button>
					</div>
				</>
			) : (
				<UserCreation />
			)}
			<ToastContainer />
		</div>
	)
}

const UserCreation = () => {
	const { mutateAsync: createUser, isError, error } = useCreateUser()

	const initialValidData = { login: true, password: true }
	const [validData, setValidData] = useState(initialValidData)

	const [user, setUser] = useState<{
		isFrozen?: boolean
		isBlocked?: boolean
		login: string
		password: string
		role: Roles
	}>({})

	useEffect(() => {
		if (isError)
			toast('Ошибка создания пользователя!', {
				type: 'error',
				theme: 'dark',
			})
	}, [isError, error?.message])

	return (
		<>
			<h3>Создание пользователя</h3>
			<div className={styles.div}>
				<p>Логин</p>
				<input
					type='text'
					value={user?.login || ''}
					className={`${styles.input} ${!validData.login ? styles.error : ''}`}
					maxLength={30}
					title={
						'Логин должен содержать 4-30 латинских символов. ' +
						'Можно использовать числа'
					}
					onChange={e => {
						setValidData(prev => ({
							...prev,
							login: /^[a-zA-Z0-9]{4,30}$/.test(e.target.value),
						}))
						setUser(prev => ({
							...prev,
							login: e.target.value,
						}))
					}}
				/>
			</div>
			<div className={styles.div}>
				<p>Пароль</p>
				<input
					type='password'
					value={user?.password || ''}
					className={`${styles.input} ${
						!validData.password ? styles.error : ''
					}`}
					maxLength={120}
					title={
						'Пароль должен содержать 8-120 латинских символов, включать символы ' +
						'!@#$%^&*, иметь Хотя бы одну заглавную букву'
					}
					onChange={e => {
						setValidData(prev => ({
							...prev,
							password: new RegExp(
								/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,120}/g
							).test(e.target.value),
						}))
						setUser(prev => ({
							...prev,
							password: e.target.value,
						}))
					}}
				/>
			</div>
			<div className={styles.div}>
				<div className={styles.radio}>
					<p>Стандартный</p>
					<input
						name={'role'}
						type='radio'
						value={Roles.DEFAULT}
						checked={user.role === Roles.DEFAULT}
						onChange={e =>
							setUser(prev => ({
								...prev,
								role: e.target.value as Roles,
							}))
						}
					/>
				</div>
				<div className={styles.radio}>
					<p>Администратор</p>
					<input
						name={'role'}
						type='radio'
						value={Roles.GOD}
						checked={user.role === Roles.GOD}
						onChange={e =>
							setUser(prev => ({
								...prev,
								role: e.target.value as Roles,
							}))
						}
					/>
				</div>
				<div className={styles.radio}>
					<p>Модератор</p>
					<input
						name={'role'}
						type='radio'
						value={Roles.ADMIN}
						checked={user.role === Roles.ADMIN}
						onChange={e =>
							setUser(prev => ({
								...prev,
								role: e.target.value as Roles,
							}))
						}
					/>
				</div>
			</div>
			<div className={styles.buttons}>
				<button
					disabled={
						!validData.login ||
						!validData.password ||
						user.login === '' ||
						user.password === ''
					}
					onClick={async () => await createUser(user)}>
					Сохранить
				</button>
				<button
					disabled={!user}
					onClick={() => {
						setUser({})
						setValidData(initialValidData)
					}}>
					Очистить
				</button>
			</div>
		</>
	)
}
