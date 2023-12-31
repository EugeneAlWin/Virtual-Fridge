import { Roles } from '../../enums'

export interface ICreateUserRequest {
	login: string
	password: string
	role?: keyof typeof Roles
}

export interface ICreateUserResponse {
	id: number
	login: string
	password: string
	role: keyof typeof Roles
	isArchived: boolean
	isBanned: boolean
	createdAt: Date
	userToken: {
		userId: number
		deviceId: string
		refreshToken: string
	}[]
}
