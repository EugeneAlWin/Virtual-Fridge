export interface IDeleteChecklistRequest {
	id: number[]
	creatorId: number
}

export interface IDeleteChecklistResponse {
	count: number
}
