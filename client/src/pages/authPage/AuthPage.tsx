import { useEffect, useState } from 'react'
import styles from './authPage.module.scss'
import { v4 } from 'uuid'
import { useQuery } from '@tanstack/react-query'
import $api from '../../query/axios/base.ts'
import UserEndpoints from '../../api/users/endpoints.ts'

export const AuthPage = () => {
	const [isRegistration, setIsRegistration] = useState(false)
	const [login, setLogin] = useState('')
	const [password, setPassword] = useState('')

	const { data, refetch, error, isSuccess } = useQuery({
		queryKey: ['f'],
		queryFn: async () => {
			return isRegistration
				? await $api.post(
						`${UserEndpoints.BASE}${UserEndpoints.CREATE_USER}`,
						{ password, login, role: 'DEFAULT', deviceId: v4() },
						{
							headers: {
								'Content-Type': 'application/json',
							},
						}
				  )
				: await $api.get(
						`${UserEndpoints.BASE}${UserEndpoints.GET_USER_BY_LOGIN}/${login}`,
						{}
				  )
		},
		enabled: false,
		retry: false,
	})

	if (error) console.log(error?.response?.data)

	useEffect(() => {
		if (isSuccess && isRegistration) {
			localStorage.setItem('accessToken', data?.data.userToken[0].accessToken)
			localStorage.setItem('deviceId', data?.data.userToken[0].deviceId)
		}
	}, [isSuccess, data])
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
				<button type={'button'} className={styles.button} onClick={() => refetch()}>
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
	)
}
