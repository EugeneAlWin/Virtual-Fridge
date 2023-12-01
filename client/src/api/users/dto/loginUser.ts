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
}
