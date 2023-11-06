import { Roles } from '../../enums'

export interface IUpdateUserDataRequest {
	userId: number
	login?: string
	password?: string
	isArchived?: boolean
	isBanned?: boolean
}

export interface IUpdateUserDataResponse {
	id: number
	login: string
	password: string
	role: Roles
	isArchived: boolean
	isBanned: boolean
	createdAt: Date
}
