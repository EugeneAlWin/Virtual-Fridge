import { Input } from '@client/components/Input'
import { useAuth } from '@client/queries/auth/useAuth'
import { useRegistration } from '@client/queries/auth/useRegistration'
import useVirtualStore from '@client/storage'
import { Roles } from '@prisma/client'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import styles from './authPage.module.scss'

export const AuthPage = () => {
	const navigate = useNavigate()

	const { setCredentials } = useVirtualStore()

	const [isRegistration, setIsRegistration] = useState(false)
	const [userCredentials, setUserCredentials] = useState({
		login: { value: '', isValid: true },
		password: { value: '', isValid: true },
	})

	const {
		data: loggedUserData,
		mutateAsync: loginUser,
		isSuccess: isLoginSuccess,
		isError: isLoginError,
		error: authError,
	} = useAuth()

	const {
		data,
		mutateAsync: registerUser,
		error: registrationError,
		isSuccess: isSuccessRegistration,
		isError: isRegistrationError,
	} = useRegistration()

	useEffect(() => {
		if (isLoginError || isRegistrationError)
			toast.error(authError?.message || registrationError?.message, {
				autoClose: 5000,
				theme: 'dark',
			})
	}, [isLoginError, isRegistrationError])

	useEffect(() => {
		//TODO: wtf
		if (isSuccessRegistration || isLoginSuccess) {
			const receivedData = data || loggedUserData
			if (!receivedData) return
			localStorage.setItem('refreshToken', receivedData.refreshToken)
			localStorage.setItem('deviceId', receivedData.user.deviceId)
			localStorage.setItem('userId', receivedData.user.id)
			localStorage.setItem('storageId', receivedData.user.Storage?.id || '')
			localStorage.setItem('role', receivedData.user.role)
			localStorage.setItem('login', receivedData.user.login)
			setCredentials({
				login: receivedData.user.login,
				role: receivedData.user.role,
				deviceId: receivedData.user.deviceId,
				userId: receivedData.user.id,
				storageId: receivedData.user.Storage?.id || '',
			})

			navigate(
				receivedData.user.role === Roles.ADMIN
					? '/admin/users/'
					: '/user/storage'
			)
		}
	}, [data, isLoginSuccess, isSuccessRegistration, loggedUserData])

	return (
		<>
			<div className={styles.container}>
				<div className={styles.authorizationWindow}>
					<p className={styles.regText}>
						{isRegistration ? 'Регистрация' : 'Авторизация'}
					</p>
					<div className={styles.inputsContainer}>
						<Input
							type='text'
							placeholder={'Введите логин'}
							maxLength={30}
							value={userCredentials.login.value}
							onChange={e => {
								setUserCredentials(prev => ({
									...prev,
									login: {
										value: e.target.value,
										isValid: new RegExp(/^[a-zA-Z0-9]{4,30}$/).test(
											e.target.value
										),
									},
								}))
							}}
							label={'Логин'}
							errorText={
								'Логин должен содержать 4-30 латинских символов. ' +
								'Можно использовать числа'
							}
							hasError={!userCredentials.login.isValid}
						/>
						<br />
						<Input
							label={'Пароль'}
							type='password'
							placeholder={'Введите пароль'}
							maxLength={120}
							value={userCredentials.password.value}
							onChange={e => {
								setUserCredentials(prev => ({
									...prev,
									password: {
										value: e.target.value,
										isValid: new RegExp(
											/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,120}/g
										).test(e.target.value),
									},
								}))
							}}
							errorText={`Пароль должен содержать 8-120 латинских символов, включать символы !@#$%^&*, иметь Хотя бы одну заглавную букву`}
							hasError={!userCredentials.password.isValid}
						/>
					</div>
					<br />
					<br />
					<button
						type={'button'}
						className={styles.button}
						disabled={
							!(
								userCredentials.login.isValid &&
								userCredentials.password.isValid
							) ||
							!userCredentials.login.value ||
							!userCredentials.password.value
						}
						onClick={async () => {
							const action = isRegistration ? registerUser : loginUser
							await action({
								login: userCredentials.login.value,
								password: userCredentials.password.value,
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
		</>
	)
}
