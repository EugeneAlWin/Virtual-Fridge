import { IErrorResponse } from '../api/errorResponse'

export default class UserRequestError extends Error {
	code
	location
	field

	constructor({ code, message, field, location }: IErrorResponse) {
		super(message)
		this.code = code
		this.field = field
		this.location = location
	}

	static NotFound(message: string) {
		return new UserRequestError({ code: 404, message })
	}

	static BadRequest(message: string) {
		return new UserRequestError({ code: 400, message })
	}

	static UnprocessableEntity(error: Omit<IErrorResponse, 'code'>) {
		return new UserRequestError({ code: 422, ...error })
	}
}
