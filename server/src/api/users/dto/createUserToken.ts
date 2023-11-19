export interface ICreateUserTokenRequest {
	userId: number
	refreshToken: string
	deviceId: string
}

export interface ICreateUserTokenResponse {
	userId: number
	deviceId: string
	refreshToken: string
}
