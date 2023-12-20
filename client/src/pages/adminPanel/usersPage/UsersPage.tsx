import styles from './usersPage.module.scss'
import { useState } from 'react'
import { ICreateUserRequest } from '../../../api/users/dto/createUser.ts'
import { Roles } from '../../../api/enums.ts'
import { SearchInput } from '../../../components/searchInput/SearchInput.tsx'
import { useGetAllUsers } from '../../../query/adminPanel/useGetAllUsers.ts'
import { useDropUser } from '../../../query/adminPanel/useDropUser.ts'
import { SelectedUser } from '../../../query/adminPanel/useUpdateUser.ts'
import { v4 } from 'uuid'
import { UserCreationForm } from '../../../components/userCreationForm/UserCreationForm.tsx'

export const UsersPage = () => {
	const newUserInitState = {
		login: '',
		role: Roles.DEFAULT,
		password: '',
		deviceId: v4(),
	}

	const [showArchived, setShowArchived] = useState(false)
	const [search, setSearch] = useState('')
	const [selectedUser, setSelectedUser] = useState<SelectedUser>(null)
	const [newUser, setNewUser] = useState<ICreateUserRequest>(newUserInitState)

	const { data, error, fetchNextPage, hasNextPage, isLoading } = useGetAllUsers()
	const { mutateAsync: dropUser } = useDropUser()

	if (error) return <p>Error</p>
	if (isLoading) return <h2>Loading...</h2>
	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
				<SearchInput search={search} onChange={e => setSearch(e.target.value)}>
					<div style={{ marginLeft: '2%' }}>
						<p>Показать архив?</p>
						<input
							type='checkbox'
							checked={showArchived}
							onChange={e => setShowArchived(e.target.checked)}
						/>
					</div>
				</SearchInput>
			</div>
			<div className={styles.container}>
				<UserCreationForm
					selectedUser={selectedUser}
					setSelectedUser={setSelectedUser}
					newUser={newUser}
					setNewUser={setNewUser}
					newUserInitState={newUserInitState}
				/>
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
