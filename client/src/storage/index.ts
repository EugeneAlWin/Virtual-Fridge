import { Roles } from '@prisma/client'
import { create } from 'zustand'

const useVirtualStore = create<{
	userId: string | null
	deviceId: string | null
	role: Roles
	login: string | null
	setCredentials: (params: {
		userId: string | null
		deviceId: string | null
		role: Roles
		login: string | null
	}) => void
	checkStorageHealth: () => boolean
}>((set, get) => ({
	deviceId: localStorage.getItem('deviceId'),
	login: localStorage.getItem('login'),
	role: localStorage.getItem('role') as Roles,
	userId: localStorage.getItem('userId'),
	setCredentials: params => set(() => ({ ...params })),
	checkStorageHealth: () => Object.values(get()).every(item => item),
}))

export default useVirtualStore
