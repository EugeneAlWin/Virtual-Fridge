import { useEffect, useState } from 'react'
import styles from './authPage.module.scss'
import useVirtualStore from '../../storage'
import { useAuth } from '../../query/auth/useAuth.ts'
import { useRegistration } from '../../query/auth/useRegistration.ts'
import { useNavigate } from 'react-router-dom'
import { Roles } from '../../api/enums.ts'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthInput } from '@client/components/authInput/AuthInput.tsx'

export const AuthPage = () => {
	const navigate = useNavigate()

	const { setCredentials } = useVirtualStore()


	const [isRegistration, setIsRegistration] = useState(false)
	const [userCreds, setUserCreds] = useState({
		login: { value: '', isValid: true },
		password: { value: '', isValid: true },
	})

	const {
		data: loggedUserData,
		loginUser,
		isLoginSuccess,
		isLoginError,
		error: authError,
	} = useAuth()

	const {
		data,
		registerUser,
		error: registrationError,
		isSuccessRegistration,
		isRegistrationError,
	} = useRegistration()

	useEffect(() => {
		if (isLoginError || isRegistrationError)
			toast.error(authError?.message || registrationError?.message, {
				autoClose: 5000,
				theme: 'dark',
			})
	}, [isLoginError, isRegistrationError])

	useEffect(() => {
		if (isSuccessRegistration || isLoginSuccess) {
			const receivedData = data || loggedUserData
			if (!receivedData) return
			localStorage.setItem('accessToken', receivedData.accessToken)
			localStorage.setItem('deviceId', receivedData.deviceId)
			localStorage.setItem('userId', receivedData.userId.toString())
			localStorage.setItem('role', receivedData.role)
			localStorage.setItem('login', receivedData.login)
			setCredentials({
				login: receivedData.login,
				role: receivedData?.role,
				deviceId: receivedData.deviceId,
				userId: receivedData.userId.toString(),
			})

			navigate(receivedData.role === Roles.ADMIN ? '/admin/users/' : '/user/store')
		}
	}, [data, isLoginSuccess, isSuccessRegistration, loggedUserData])

	return (
		<>
			<div
				style={{
					width: '100%',
				}}>
				<div className={styles.authorizationWindow}>
					<p className={styles.regText}>
						{isRegistration ? 'Регистрация' : 'Авторизация'}
					</p>
					<div className={styles.inputsContainer}>
						<AuthInput
							id={'login'}
							type='text'
							placeholder={'Введите логин'}
							maxLength={30}
							value={userCreds.login.value}
							onChange={e => {
								setUserCreds(prev => ({
									...prev,
									login: {
										value: e.target.value,
										isValid: new RegExp(/^[a-zA-Z0-9]{4,30}$/).test(
											e.target.value
										),
									},
								}))
							}}
							className={`${styles.input} ${userCreds.login.isValid ? '' : styles.error
								}`}
							errorText={
								'Логин должен содержать 4-30 латинских символов. ' +
								'Можно использовать числа'
							}
							hasError={!userCreds.login.isValid}
						/>
						<br />
						<AuthInput
							id={'password'}
							type='password'
							placeholder={'Введите пароль'}
							maxLength={120}
							value={userCreds.password.value}
							onChange={e => {
								setUserCreds(prev => ({
									...prev,
									password: {
										value: e.target.value,
										isValid: new RegExp(
											/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,120}/g
										).test(e.target.value),
									},
								}))
							}}
							className={`${styles.input} ${userCreds.password.isValid ? undefined : styles.error
								}`}
							errorText={`Пароль должен содержать 8-120 латинских символов, включать символы !@#$%^&*, иметь Хотя бы одну заглавную букву`}
							hasError={!userCreds.password.isValid}
						/>
					</div>
					<br />
					<br />
					<button
						type={'button'}
						className={styles.button}
						disabled={
							!(userCreds.login.isValid && userCreds.password.isValid) ||
							!userCreds.login.value ||
							!userCreds.password.value
						}
						onClick={async () => {
							const action = isRegistration ? registerUser : loginUser
							await action({
								login: userCreds.login.value,
								password: userCreds.password.value,
							})
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
				</div>
			</div>
			<ToastContainer />
		</>
	)
}
