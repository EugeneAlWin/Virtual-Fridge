export interface IDeleteChecklistRequest {
	checklistsId: number[]
	creatorId: number
}

export interface IDeleteChecklistResponse {
	count: number
}
