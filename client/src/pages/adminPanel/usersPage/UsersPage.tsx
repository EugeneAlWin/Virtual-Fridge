import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import $api from '../../../query/axios/base.ts'
import axios, { AxiosResponse } from 'axios'
import styles from './usersPage.module.scss'
import { useState } from 'react'
import queryClient from '../../../query/queryClient.ts'
import UserEndpoints from '../../../api/users/endpoints.ts'
import { IGetAllUsersResponse } from '../../../api/users/dto/getAllUsers.ts'
import { IDeleteUsersResponse } from '../../../api/users/dto/deleteUsers.ts'
import {
	ICreateUserRequest,
	ICreateUserResponse,
} from '../../../api/users/dto/createUser.ts'
import {
	IUpdateUserDataRequest,
	IUpdateUserDataResponse,
} from '../../../api/users/dto/updateUserData.ts'
import { Roles } from '../../../api/enums.ts'
import { v4 } from 'uuid'
import { IErrorResponse } from '../../../api/errorResponse.ts'

export const UsersPage = () => {
	const [showArchived, setShowArchived] = useState(false)
	const { data, error, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<
		IGetAllUsersResponse,
		IErrorResponse
	>({
		queryKey: ['users'],
		queryFn: async ({ pageParam }) => {
			try {
				const result = await $api.get<
					AxiosResponse<IErrorResponse>,
					AxiosResponse<IGetAllUsersResponse>
				>(`${UserEndpoints.BASE}${UserEndpoints.GET_ALL_USERS}`, {
					params: {
						skip: 0,
						take: pageParam?.pageSize || 25,
						cursor: pageParam?.cursor,
						isArchived: false,
						isBanned: false,
					},
				})
				console.log(result.data.cursor)
				return { usersData: result.data?.usersData, cursor: result.data?.cursor }
			} catch (e) {
				if (axios.isAxiosError(e)) throw e?.response?.data
				throw e
			}
		},
		refetchOnWindowFocus: false,
		initialPageParam: { pageSize: 25, cursor: null },
		getNextPageParam: lastPage => {
			if (lastPage.usersData.length < 25) return
			return {
				cursor: lastPage?.cursor ? lastPage.cursor + 1 : null,
				pageSize: 25,
			}
		},
		retry: false,
	})
	const [search, setSearch] = useState('')
	const [selectedUser, setSelectedUser] = useState<null | {
		userId: number
		login: string
		isBanned: boolean
		isArchived: boolean
		password: string
	}>(null)

	const newUserInitState = {
		login: '',
		role: Roles.DEFAULT,
		password: '',
		deviceId: v4(),
	}
	const [newUser, setNewUser] = useState<ICreateUserRequest>(newUserInitState)

	const { mutateAsync: dropUser } = useMutation({
		mutationFn: async (id: number) => {
			try {
				const result = await $api.delete<IDeleteUsersResponse>(
					`${UserEndpoints.BASE}${UserEndpoints.DELETE_USERS}`,
					{
						data: {
							userIds: [id],
						},
					}
				)
				return result.data.count
			} catch (e) {
				if (axios.isAxiosError(e)) throw e?.response?.data
				throw e
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['users'],
			})
		},
	})

	const { mutateAsync: createUser } = useMutation({
		mutationFn: async () => {
			try {
				if (!newUser) return
				const result = await $api.post<
					ICreateUserResponse,
					IErrorResponse,
					ICreateUserRequest
				>(`${UserEndpoints.BASE}${UserEndpoints.CREATE_USER}`, {
					login: newUser.login,
					password: newUser.password,
					role: newUser.role,
					deviceId: newUser.deviceId,
				})
				return result.data
			} catch (e) {
				if (axios.isAxiosError(e)) throw e?.response?.data
				throw e
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['users'],
			})
		},
	})
	const { mutateAsync: updateUser } = useMutation({
		mutationFn: async () => {
			try {
				if (!selectedUser) return
				const result = await $api.patch<
					IUpdateUserDataResponse,
					IErrorResponse,
					IUpdateUserDataRequest
				>(`${UserEndpoints.BASE}${UserEndpoints.UPDATE_USER_DATA}`, {
					userId: selectedUser.userId,
					login: selectedUser.login || undefined,
					password: selectedUser.password || undefined,
					isBanned: selectedUser.isBanned,
					isArchived: selectedUser.isArchived,
				})
				return result.data
			} catch (e) {
				if (axios.isAxiosError(e)) throw e?.response?.data
				throw e
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['users'],
			})
		},
	})

	if (error) return <p>Error</p>
	if (isLoading) return <h2>Loading...</h2>
	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
				<div>
					<p>Искать</p>
					<input
						type='text'
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
				</div>
				<div>
					<p>show archive</p>
					<input
						type='checkbox'
						checked={showArchived}
						onChange={e => setShowArchived(e.target.checked)}
					/>
				</div>
			</div>
			<div className={styles.container}>
				<div className={styles.modal}>
					{selectedUser ? (
						<>
							<p>Редактирование пользователя</p>
							<div>
								<p>логин</p>
								<input
									type='text'
									value={selectedUser.login}
									onChange={e =>
										setSelectedUser(prev => ({
											...prev,
											login: e.target.value,
										}))
									}
								/>
							</div>
							<div>
								<p>пароль</p>
								<input
									type='password'
									value={selectedUser.password || ''}
									onChange={e =>
										setSelectedUser(prev => ({
											...prev,
											password: e.target.value,
										}))
									}
								/>
							</div>
							<div>
								<p>В бане</p>
								<input
									type='checkbox'
									checked={selectedUser.isBanned}
									onChange={e =>
										setSelectedUser(prev => ({
											...prev,
											isBanned: e.target.checked,
										}))
									}
								/>
							</div>
							<div>
								<p>Удален</p>
								<input
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
									onClick={async () => {
										await updateUser()
										setSelectedUser(null)
									}}>
									Сохранить
								</button>
								<button onClick={() => setSelectedUser(null)}>Отменить</button>
							</div>
						</>
					) : (
						<>
							<p>Создание пользователя</p>
							<div>
								<p>логин</p>
								<input
									type='text'
									value={newUser?.login || ''}
									onChange={e =>
										setNewUser(prev => ({
											...prev,
											login: e.target.value,
										}))
									}
								/>
							</div>
							<div>
								<p>пароль</p>
								<input
									type='password'
									value={newUser?.password || ''}
									onChange={e =>
										setNewUser(prev => ({
											...prev,
											password: e.target.value,
										}))
									}
								/>
							</div>
							<div>
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
							<div>
								<button onClick={async () => createUser()}>Сохранить</button>
								<button
									disabled={!newUser}
									onClick={() => setNewUser(newUserInitState)}>
									Отменить
								</button>
							</div>
						</>
					)}
				</div>
				<div className={styles.cardsContainer}>
					{data?.pages.map(
						page =>
							page.usersData
								?.filter(
									item =>
										item?.login.toLowerCase().includes(search.toLowerCase()) &&
										item.isArchived === showArchived
								)
								.map(item => (
									<div className={styles.card} key={item.id}>
										<p>{item.login}</p>
										<div>
											<div>
												<p>Роль: {item.role}</p>
												<p>В бане: {item.isBanned ? 'да' : 'нет'}</p>
												<p>В архиве: {item.isArchived ? 'да' : 'нет'}</p>
												<p>
													Дата создания:{' '}
													{new Date(item.createdAt).toLocaleDateString()}
												</p>
											</div>
											<div className={styles.cardEditBar}>
												<button
													onClick={() =>
														setSelectedUser({
															userId: item.id,
															login: item.login,
															isArchived: item.isArchived,
															isBanned: item.isBanned,
															password: '',
														})
													}>
													Редактировать
												</button>
												{showArchived && (
													<button
														className={styles.redButton}
														onClick={async () => await dropUser(item.id)}>
														Удалить навсегда
													</button>
												)}
											</div>
										</div>
									</div>
								))
					)}
					{hasNextPage && <button onClick={() => fetchNextPage()}>Ещё</button>}
				</div>
			</div>
		</>
	)
}
