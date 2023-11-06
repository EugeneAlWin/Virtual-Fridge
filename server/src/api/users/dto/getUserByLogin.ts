import { Roles } from '../../enums'

export interface IGetUserByLoginRequest {
	login: string
}

export interface IGetUserByLoginResponse {
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
