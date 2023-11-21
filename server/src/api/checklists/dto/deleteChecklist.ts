export interface IDeleteChecklistsRequest {
	checklistsId: number[]
	creatorId: number
}

export interface IDeleteChecklistsResponse {
	count: number
}
