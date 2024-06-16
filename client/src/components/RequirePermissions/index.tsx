import useVirtualStore from '@client/storage'
import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { Roles } from '~shared/enums'

export const RequirePermissions = ({
	children,
	isRootRequire = false,
}: {
	children: ReactNode
	isRootRequire?: boolean
}) => {
	const { checkStorageHealth, role } = useVirtualStore()
	const health = checkStorageHealth()

	if (!health || (health && isRootRequire && role === Roles.DEFAULT))
		return <Navigate to={'/auth'} />

	return children
}
