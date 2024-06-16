import { create } from 'zustand'
import { Roles } from '~shared/enums'

const useVirtualStore = create<{
	userId: string | null
	storageId: string | null
	deviceId: string | null
	role: Roles
	login: string | null
	setCredentials: (params: {
		userId: string | null
		deviceId: string | null
		role: Roles
		login: string | null
		storageId: string
	}) => void
	checkStorageHealth: () => boolean
}>((set, get) => ({
	storageId: localStorage.getItem('storageId'),
	deviceId: localStorage.getItem('deviceId'),
	login: localStorage.getItem('login'),
	role: localStorage.getItem('role') as Roles,
	userId: localStorage.getItem('userId'),
	setCredentials: params => set(() => ({ ...params })),
	checkStorageHealth: () => Object.values(get()).every(item => item),
}))

export default useVirtualStore
