import { Roles } from '../../enums'

export interface ICreateUserRequest {
	login: string
	password: string
	role: keyof typeof Roles
	deviceId: string
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
		accessToken: string
		refreshToken: string
	}[]
}
