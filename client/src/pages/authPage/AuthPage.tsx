import { useEffect, useState } from 'react'
import styles from './authPage.module.scss'
import useVirtualStore from '../../storage'
import { useAuth } from '../../query/auth/useAuth.ts'
import { useRegistration } from '../../query/auth/useRegistration.ts'
import { useNavigate } from 'react-router-dom'
import { Roles } from '../../api/enums.ts'

export const AuthPage = () => {
	const [isRegistration, setIsRegistration] = useState(false)
	const [login, setLogin] = useState('')
	const [password, setPassword] = useState('')

	const navigate = useNavigate()

	const {
		data: loggedUserData,
		loginUser,
		isLoginSuccess,
		isLoginError,
		error: authError,
	} = useAuth()
	const { data, registerUser, error, isSuccessRegistration, isRegistrationError } =
		useRegistration()
	const { setCredentials } = useVirtualStore()
	if (error) console.log(error)

	useEffect(() => {
		if (isSuccessRegistration && isRegistration && data) {
			localStorage.setItem('accessToken', data.accessToken)
			localStorage.setItem('deviceId', data.deviceId)
			localStorage.setItem('userId', data.userId.toString())
			localStorage.setItem('role', data.role)
			localStorage.setItem('login', login)
			setCredentials({
				login,
				role: data?.role,
				deviceId: data.deviceId,
				userId: data.userId.toString(),
			})
			navigate('/user/store')
		} else if (isLoginSuccess && !isRegistration && loggedUserData) {
			localStorage.setItem('accessToken', loggedUserData.accessToken)
			localStorage.setItem('deviceId', loggedUserData.deviceId)
			localStorage.setItem('userId', loggedUserData.userId.toString())
			localStorage.setItem('role', loggedUserData.role)
			localStorage.setItem('login', login)
			setCredentials({
				login,
				deviceId: loggedUserData.deviceId,
				userId: loggedUserData.userId.toString(),
				role: loggedUserData.role,
			})
			navigate(loggedUserData.role === Roles.DEFAULT ? '/user/store' : '/admin/users/')
		}
	}, [
		navigate,
		data,
		isLoginSuccess,
		isRegistration,
		isSuccessRegistration,
		loggedUserData,
		login,
		setCredentials,
	])

	return (
		<div
			style={{
				width: '100%',
			}}>
			<div className={styles.authorizationWindow}>
				<p className={styles.regText}>
					{isRegistration ? 'Регистрация' : 'Авторизация'}
				</p>
				<div className={styles.inputsContainer}>
					<input
						type='text'
						placeholder={'Введите логин'}
						maxLength={30}
						value={login}
						onChange={e => setLogin(e.target.value)}
						className={styles.input}
					/>
					<br />
					<input
						type='password'
						placeholder={'Введите пароль'}
						maxLength={120}
						value={password}
						onChange={e => setPassword(e.target.value)}
						className={styles.input}
					/>
				</div>
				<br />
				<br />
				<button
					type={'button'}
					className={styles.button}
					onClick={async () => {
						isRegistration
							? await registerUser({ login, password })
							: await loginUser({ login, password })
					}}>
					Отправить
				</button>
				<br />
				<div>
					{isRegistration ? (
						<p>
							Уже есть аккаунт? Попробуйте{' '}
							<mark
								className={styles.authorizationMark}
								onClick={() => setIsRegistration(false)}>
								войти
							</mark>
						</p>
					) : (
						<p>
							Нет аккаунта?{' '}
							<mark
								className={styles.authorizationMark}
								onClick={() => setIsRegistration(true)}>
								Зарегистрируйтесь!
							</mark>
						</p>
					)}
				</div>
				{(isRegistrationError || isLoginError) && (
					<p style={{ color: 'red', marginTop: '5px' }}>
						{authError?.response.data.message || error?.response.data.message}
					</p>
				)}
			</div>
		</div>
	)
}
