import { create } from 'zustand'
import { Roles } from '../api/enums.ts'

const useVirtualStore = create<{
	userId: number | undefined
	deviceId: string | undefined
	accessToken: string | undefined
	role: keyof typeof Roles | undefined
	login: string | undefined
}>(() => ({
	userId: undefined,
	deviceId: undefined,
	accessToken: undefined,
	role: undefined,
	login: undefined,
}))

export default useVirtualStore
