import { Request } from 'express'
import { validationResult } from 'express-validator'

export default function getValidationResult(
	req: Request<Record<never, never> | undefined>
) {
	const validatedData = validationResult(req)
	return validatedData.isEmpty() ? null : validatedData.array()[0]
}
