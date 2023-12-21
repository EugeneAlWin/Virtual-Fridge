import { Roles } from '../../api/enums.ts'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { SelectedUser, useUpdateUser } from '../../query/adminPanel/useUpdateUser.ts'
import { ICreateUserRequest } from '../../api/users/dto/createUser.ts'
import { useCreateUser } from '../../query/adminPanel/useCreateUser.ts'
import styles from './userCreationForm.module.scss'
import { toast, ToastContainer } from 'react-toastify'

interface UserCreationFormProps {
	selectedUser: SelectedUser
	setSelectedUser: Dispatch<SetStateAction<SelectedUser>>
	newUser: ICreateUserRequest
	setNewUser: Dispatch<SetStateAction<ICreateUserRequest>>
	newUserInitState: {
		login: string
		role: keyof typeof Roles
		password: string
		deviceId: string
	}
}

export function UserCreationForm({
	selectedUser,
	setSelectedUser,
	setNewUser,
	newUser,
	newUserInitState,
}: UserCreationFormProps) {
	const [validData, setValidData] = useState({ login: true, password: true })

	const { mutateAsync: createUser, isError, error } = useCreateUser()
	const {
		mutateAsync: updateUser,
		isError: isUpdateError,
		error: updateError,
	} = useUpdateUser()

	useEffect(() => {
		if (isError) toast(error?.message, { type: 'error', theme: 'dark' })
		if (isUpdateError) toast(updateError?.message, { type: 'error', theme: 'dark' })
	}, [isUpdateError, isError, error?.message, updateError?.message])

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
									login: new RegExp(/^[a-zA-Z0-9]{4,30}$/).test(e.target.value),
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
									password: new RegExp(
										/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,120}/g
									).test(e.target.value),
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
							checked={selectedUser.isArchived}
							onChange={e =>
								setSelectedUser(prev => ({
									...prev,
									isArchived: e.target.checked,
								}))
							}
						/>
					</div>
					<div>
						<button
							disabled={
								!selectedUser ||
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
						<button onClick={() => setSelectedUser(null)}>Отменить</button>
					</div>
				</>
			) : (
				<>
					<h3>Создание пользователя</h3>
					<div className={styles.div}>
						<p>Логин</p>
						<input
							type='text'
							value={newUser?.login || ''}
							className={`${styles.input} ${!validData.login ? styles.error : ''}`}
							maxLength={30}
							title={
								'Логин должен содержать 4-30 латинских символов. ' +
								'Можно использовать числа'
							}
							onChange={e => {
								setValidData(prev => ({
									...prev,
									login: new RegExp(/^[a-zA-Z0-9]{4,30}$/).test(e.target.value),
								}))
								setNewUser(prev => ({
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
							value={newUser?.password || ''}
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
								setNewUser(prev => ({
									...prev,
									password: e.target.value,
								}))
							}}
						/>
					</div>
					<div className={styles.div}>
						<p>Администратор?</p>
						<input
							type='checkbox'
							value={newUser?.role}
							onChange={e =>
								setNewUser(prev => ({
									...prev,
									role: e.target.checked ? Roles.ADMIN : Roles.DEFAULT,
								}))
							}
						/>
					</div>
					<div className={styles.buttons}>
						<button
							disabled={
								!newUser ||
								!validData.login ||
								!validData.password ||
								newUser.login === '' ||
								newUser.password === ''
							}
							onClick={async () => createUser(newUser)}>
							Сохранить
						</button>
						<button
							disabled={!newUser}
							onClick={() => {
								setNewUser(newUserInitState)
							}}>
							Отменить
						</button>
					</div>
				</>
			)}
			<ToastContainer />
		</div>
	)
}
