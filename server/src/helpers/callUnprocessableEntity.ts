import { NextFunction } from 'express'
import {
	FieldValidationError,
	ValidationError,
} from 'express-validator'
import UserRequestError from '../errors/userRequestError'

//Helper, passes UnprocessableEntity error to middleware
export default function callUnprocessableEntity(
	next: NextFunction,
	error: ValidationError
) {
	return next(
		UserRequestError.UnprocessableEntity({
			message: error.msg,
			location: (error as FieldValidationError).location,
			field: (error as FieldValidationError).path,
			value: (error as FieldValidationError)?.value,
		})
	)
}
