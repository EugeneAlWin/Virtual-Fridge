export interface IDeleteUserTokensRequest {
	userId: number
	devicesId: string[]
}

export interface IDeleteUserTokensResponse {
	count: number
}
