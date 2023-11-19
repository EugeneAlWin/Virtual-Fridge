export interface IUpdateUserTokenRequest {
	userId: number
	refreshToken: string
	deviceId: string
}

export interface IUpdateUserTokenResponse {
	userId: number
	deviceId: string
	refreshToken: string
}
