export interface IGetUserTokensRequest {
	userId: number
}

export interface IGetUserTokensResponse {
	userId: number
	deviceId: string
	refreshToken: string
}
