import { Roles } from '../../enums'

export interface ICreateUserRequest {
	login: string
	password: string
	role: Roles
	deviceId: string
	refreshToken: string
}

export interface ICreateUserResponse {
	id: number
	login: string
	password: string
	role: Roles
	isArchived: boolean
	isBanned: boolean
	createdAt: Date
	UserToken: {
		id: number
		userId: number
		deviceId: string
		refreshToken: string
	}[]
}
