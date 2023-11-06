export interface IGetUserTokensRequest {
	userId: number
}

export interface IGetUserTokensResponse {
	id: number
	userId: number
	deviceId: string
	refreshToken: string
}
