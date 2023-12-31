import { Roles } from '../../enums'

export interface IUpdateUserDataRequest {
	userId: number
	login?: string
	password?: string
	role?: keyof typeof Roles
	isArchived?: boolean
	isBanned?: boolean
}

export interface IUpdateUserDataResponse {
	id: number
	login: string
	password: string
	role: keyof typeof Roles
	isArchived: boolean
	isBanned: boolean
	createdAt: Date
}
