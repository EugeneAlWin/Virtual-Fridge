export interface IDeleteProductsRequest {
	creatorId: number
	productsId: number[]
}

export interface IDeleteProductsResponse {
	count: number
}
