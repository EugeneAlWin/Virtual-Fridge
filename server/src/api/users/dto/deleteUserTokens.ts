export interface IDeleteUserTokensRequest {
	userId: number
	deviceId: string[]
}

export interface IDeleteUserTokensResponse {
	count: number
}
