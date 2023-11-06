export interface IUpdateUserTokenRequest {
	userId: number
	refreshToken: string
	deviceId: string
}

export interface IUpdateUserTokenResponse {
	id: number
	userId: number
	deviceId: string
	refreshToken: string
}
