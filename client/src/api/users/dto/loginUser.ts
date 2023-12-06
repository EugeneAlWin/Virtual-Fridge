import { Roles } from '../../enums.ts'

export interface ILoginUserRequest {
	login: string
	password: string
	deviceId: string
}

export interface ILoginUserRequestCookies {
	refreshToken: string
}

export interface ILoginUserResponse {
	userId: number
	refreshToken: string
	accessToken: string
	deviceId: string
	role: keyof typeof Roles
	login: string
}
