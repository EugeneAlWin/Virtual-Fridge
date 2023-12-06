import { ReactNode } from 'react'
import useVirtualStore from '../../storage'
import { Navigate } from 'react-router-dom'
import { Roles } from '../../api/enums.ts'

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
