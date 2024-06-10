import { Search } from '@client/components/Search'
// import { UserCreationForm } from '@client/components/userCreationForm/UserCreationForm'
import { useDropUser } from '@client/queries/users/useDropUser'
import { useGetAllUsers } from '@client/queries/users/useGetAllUsers'
import { Roles } from '@prisma/client'
import { useState } from 'react'
import { debounce } from 'remeda'
import styles from './usersPage.module.scss'

const rolesConverter = {
	[Roles.ADMIN]: 'Модератор',
	[Roles.GOD]: 'Администратор',
	[Roles.DEFAULT]: 'Обычный пользователь',
}

export const UsersPage = () => {
	const [showArchived, setShowArchived] = useState(false)
	const [search, setSearch] = useState('')
	const [queryParameter, setQueryParameter] = useState('')

	const debouncer = debounce((text: string) => setQueryParameter(text), {
		waitMs: 300,
	})
	const [selectedUser, setSelectedUser] = useState<SelectedUser>(null)

	const { data, error, fetchNextPage, hasNextPage, isLoading } =
		useGetAllUsers({ login: queryParameter })

	const { mutateAsync: dropUser } = useDropUser()

	if (error) return <p>Error</p>
	if (isLoading || !data) return <h2>Loading...</h2>
	const pages = data?.pages.map(page => page.users).flat(1)

	return (
		<>
			<div className={styles.container}>
				<div className={styles.leftSide}>
					<Search
						label={'Искать пользователя'}
						search={search}
						onChange={e => {
							setSearch(e.target.value)
							debouncer.call(e.target.value)
						}}>
						<div style={{ marginLeft: '2%' }}>
							<p>Показать архив?</p>
							<input
								type='checkbox'
								checked={showArchived}
								onChange={e => setShowArchived(e.target.checked)}
							/>
						</div>
					</Search>
					{/*<UserCreationForm*/}
					{/*	selectedUser={selectedUser}*/}
					{/*	setSelectedUser={setSelectedUser}*/}
					{/*/>*/}
				</div>
				<div className={styles.cardsContainer}>
					{pages
						.filter(user => user.isFrozen === showArchived)
						.map(user => (
							<div className={styles.card} key={user.id}>
								<p>{user.login}</p>
								<div>
									<div>
										<p>Роль: {rolesConverter[user.role]}</p>
										<p>В архиве: {user.isFrozen ? 'да' : 'нет'}</p>
										<p>
											Дата создания:{' '}
											{new Date(user.createdAt).toLocaleDateString()}
										</p>
									</div>
									<div className={styles.cardEditBar}>
										<button
											onClick={() =>
												setSelectedUser({ ...user, password: '' })
											}>
											Редактировать
										</button>
										{showArchived && (
											<button
												className={styles.redButton}
												onClick={async () =>
													await dropUser(user.id)
												}>
												Удалить навсегда
											</button>
										)}
									</div>
								</div>
							</div>
						))}
					{hasNextPage && (
						<button
							className={styles.moreButton}
							onClick={() => fetchNextPage()}>
							Ещё
						</button>
					)}
				</div>
			</div>
		</>
	)
}
