import useVirtualStore from '@client/storage'
import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

export const RequireAuth = ({
	children,
	isRootRequire = false,
}: {
	children: ReactNode
	isRootRequire?: boolean
}) => {
	const { checkStorageHealth, role } = useVirtualStore()

	return checkStorageHealth() ? (
		isRootRequire ? (
			role === Roles.ADMIN ? (
				children
			) : (
				<Navigate to={'/auth'} />
			)
		) : (
			children
		)
	) : (
		<Navigate to={'/auth'} />
	)
}
