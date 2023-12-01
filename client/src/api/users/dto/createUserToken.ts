import { Roles } from '../../enums'

export interface ICreateUserTokenRequest {
	userId: number
	deviceId: string
	login: string
	password: string
	role: keyof typeof Roles
}

export interface ICreateUserTokenResponse {
	userId: number
	deviceId: string
	accessToken: string
	refreshToken: string
}
