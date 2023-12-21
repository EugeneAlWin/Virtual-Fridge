import { IErrorResponse } from '../api/errorResponse'

export default class UserRequestError extends Error {
	code
	location
	field
	value

	constructor({ code, message, field, location, value }: IErrorResponse) {
		super(message)
		this.code = code
		this.field = field
		this.location = location
		this.value = value
	}

	static NotFound(message: string) {
		return new UserRequestError({ code: 404, message })
	}

	static BadRequest(message: string) {
		return new UserRequestError({ code: 400, message })
	}

	static Forbidden(message: string) {
		return new UserRequestError({ code: 403, message })
	}

	static UnprocessableEntity(error: Omit<IErrorResponse, 'code'>) {
		return new UserRequestError({ code: 422, ...error })
	}

	static Unauthorized() {
		return new UserRequestError({ code: 401, message: 'UNAUTHORIZED' })
	}
}
