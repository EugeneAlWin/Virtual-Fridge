export interface IGetAllChecklistsPreviewRequest {
	skip: number
	take: number
	creatorId: number
	createdAt?: Date
	cursor?: number
}

export interface IGetAllChecklistsPreviewResponse {
	checklistsData: {
		id: number
		creatorId: number
		createdAt: Date
		isConfirmed: boolean
		checklistPrices: {
			USD: number | null
			BYN: number | null
			RUB: number | null
		}
	}[]
	cursor: number | null
}
