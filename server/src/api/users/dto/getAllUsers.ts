import { Roles } from '../../enums'

export interface IGetAllUsersRequest {
	skip: number
	take: number
	cursor?: number
	login?: string
}

export interface IGetAllUsersResponse {
	id: number
	login: string
	password: string
	role: Roles
	isArchived: boolean
	isBanned: boolean
	createdAt: Date
	UserToken: {
		id: number
		userId: number
		deviceId: string
		refreshToken: string
	}[]
}
