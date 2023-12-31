import { Roles } from '../../enums'

export interface IUpdateUserTokenRequest {
	userId: number
	deviceId: string
	login: string
	role: keyof typeof Roles
}

export interface IUpdateUserTokenResponse {
	userId: number
	deviceId: string
	accessToken: string
	refreshToken: string
}
