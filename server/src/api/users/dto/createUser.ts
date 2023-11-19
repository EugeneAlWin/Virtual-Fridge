import { Roles } from '../../enums'

export interface ICreateUserRequest {
	login: string
	password: string
	role: keyof typeof Roles
	deviceId: string
	refreshToken: string
}

export interface ICreateUserResponse {
	id: number
	login: string
	password: string
	role: keyof typeof Roles
	isArchived: boolean
	isBanned: boolean
	createdAt: Date
	UserToken: {
		userId: number
		deviceId: string
		refreshToken: string
	}[]
}
