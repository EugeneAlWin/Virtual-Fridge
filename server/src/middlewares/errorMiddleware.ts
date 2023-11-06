import UserRequestError from '../errors/userRequestError'
import { NextFunction, Request, Response } from 'express'
import { IErrorResponse } from '../api/errorResponse'

export default function (
	err: Error,
	_req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_next: NextFunction
) {
	if (err instanceof UserRequestError) {
		return res.status(err?.code).json({
			code: err.code,
			message: err.message,
			field: err.field,
			location: err.location,
		} satisfies IErrorResponse)
	}

	return res.status(500).json({ message: 'SERVER ERROR' })
}
