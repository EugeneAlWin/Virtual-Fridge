import { Roles } from '../../enums.ts'

export interface IGetAllUsersRequest {
	skip: number
	take: number
	cursor?: number
	login?: string
}

export interface IGetAllUsersResponse {
	usersData: {
		id: number
		login: string
		password: string
		role: keyof typeof Roles
		isArchived: boolean
		isBanned: boolean
		createdAt: Date
		userToken: {
			userId: number
			deviceId: string
			refreshToken: string
		}[]
	}[]
	cursor: number | null
}
