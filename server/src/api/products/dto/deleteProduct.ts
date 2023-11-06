export interface IDeleteProductRequest {
	creatorId: number
	productId: number[]
}

export interface IDeleteProductResponse {
	count: number
}
