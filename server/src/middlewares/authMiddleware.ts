import { NextFunction, Request, Response } from 'express'
import UserRequestError from '../errors/userRequestError'
import Tokenizator from '../helpers/tokenizator'

export default function (
	req: Request<unknown>,
	_res: Response<unknown>,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	next: NextFunction
) {
	const authorizationHeader = req.headers.authorization
	if (!authorizationHeader) return next(UserRequestError.Unauthorized())

	const accessToken = Tokenizator.validateAccessToken(
		authorizationHeader.split(' ')[1]
	)
	if (!accessToken) return next(UserRequestError.Unauthorized())

	next()
}
