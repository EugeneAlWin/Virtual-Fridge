import { validationResult } from 'express-validator'

export default function getValidationResult(
	req: Parameters<typeof validationResult>[0]
) {
	const validatedData = validationResult(req)
	return validatedData.isEmpty() ? null : validatedData.array()[0]
}
