export interface ICreateUserTokenRequest {
	userId: number
	refreshToken: string
	deviceId: string
}

export interface ICreateUserTokenResponse {
	id: number
	userId: number
	deviceId: string
	refreshToken: string
}
