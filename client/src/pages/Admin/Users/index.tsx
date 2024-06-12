import Button from '@client/components/Button'
import Header from '@client/components/Header'
import { Search } from '@client/components/Search'
import UserCard from '@client/components/UserCard'
import { useGetAllUsers } from '@client/queries/users/useGetAllUsers'
import { useUpdateUser } from '@client/queries/users/useUpdateUser'
import { Roles } from '@prisma/client'
import { lazy, Suspense, useState } from 'react'

const UpdateUserModal = lazy(
	() => import('@client/modals/users/UpdateUserModal')
)
const CreateUserModal = lazy(
	() => import('@client/modals/users/CreateUserModal')
)

export const UsersAdminPage = () => {
	const { data, isLoading } = useGetAllUsers({})
	const [search, setSearch] = useState('')
	const [createUserModalOpen, setCreateUserModalOpen] = useState(false)
	const [updateUserModalOpen, setUpdateUserModalOpen] = useState(false)

	const [userToEdit, setUserToEdit] = useState<{
		id: string
		login: string
		password: string
		role: Roles
		createdAt: Date
		isFrozen: boolean | null
		isBlocked: boolean | null
	}>()
	const [showArchived, setShowArchived] = useState(false)
	const { mutateAsync } = useUpdateUser({})

	if (isLoading) return <h2>Loading...</h2>
	const users = data?.pages
		.map(page => page.users)
		.flat(1)
		.filter(i => (showArchived ? i.isFrozen : !i.isFrozen))

	return (
		<>
			<Header title={'Пользователи'}>
				<Button
					text={'Создать пользователя'}
					action={() => setCreateUserModalOpen(true)}
				/>
				<Button
					text={!showArchived ? 'Показать архив' : 'Скрыть архив'}
					action={() => setShowArchived(prev => !prev)}
				/>
				<Search search={search} onChange={setSearch} />
			</Header>
			{!users?.length && <h1>Пусто</h1>}
			<div
				style={{
					flexWrap: 'wrap',
					display: 'flex',
				}}>
				{users?.map(user => (
					<UserCard
						onArchivePress={() =>
							mutateAsync({ id: user.id, isFrozen: !user.isFrozen })
						}
						onEditPress={() => {
							setUserToEdit({ ...user, password: '' })
							setUpdateUserModalOpen(true)
						}}
						userInfo={user}
						key={user.id}
					/>
				))}
			</div>
			{updateUserModalOpen && userToEdit && (
				<Suspense fallback={<div>Loading...</div>}>
					<UpdateUserModal
						onCloseModal={() => setUpdateUserModalOpen(false)}
						initialState={userToEdit}
					/>
				</Suspense>
			)}
			{createUserModalOpen && (
				<Suspense fallback={<div>Loading...</div>}>
					<CreateUserModal
						onCloseModal={() => setCreateUserModalOpen(false)}
					/>
				</Suspense>
			)}
		</>
	)
}
