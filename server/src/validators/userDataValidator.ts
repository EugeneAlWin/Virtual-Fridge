import { Roles } from '../api/enums'
import BasicValidator from './basicValidator'
import { TLocation } from './types'

export default class UserDataValidator extends BasicValidator {
	static login(
		location: TLocation,
		isOptional: boolean = true,
		length: { min?: number; max: number } | undefined = undefined
	) {
		return BasicValidator.title(location, isOptional, length, 'login')
	}

	static password(
		location: TLocation,
		isOptional: boolean = false,
		length: { min?: number; max: number } | undefined = undefined
	) {
		const result = isOptional
			? location('password').optional({ values: 'undefined' })
			: location('password').isString().withMessage('SHOULD BE A STRING')

		return length
			? result
					.isLength({
						min: length.min || 0,
						max: length.max,
					})
					.withMessage(`${length?.min || 0} >= LENGTH <= ${length?.max}`)
			: result
	}

	static userId(location: TLocation) {
		return location('userId')
			.not()
			.isString()
			.withMessage('SHOULD BE AN INTEGER >= 0')
			.isInt({ min: 0 })
			.withMessage('SHOULD BE AN INTEGER >= 0')
	}

	static role(location: TLocation) {
		return location('role')
			.isString()
			.withMessage('SHOULD BE A STRING')
			.isIn(Object.values(Roles))
			.withMessage({
				message: `SHOULD BE ${Roles.DEFAULT} or ${Roles.ADMIN}`,
			})
	}

	static deviceId(location: TLocation, isArray = false) {
		return isArray
			? location('deviceId')
					.isArray()
					.withMessage('SHOULD BE AN ARRAY OF STRINGS')
			: location('deviceId')
					.isString()
					.withMessage('SHOULD BE A STRING')
					.not()
					.isEmpty()
					.withMessage('SHOULD BE A NON EMPTY STRING')
	}

	static deviceIdArrayEntries(location: TLocation) {
		return location('deviceId.*')
			.isString()
			.withMessage('SHOULD BE A STRING')
			.not()
			.isEmpty()
			.withMessage('SHOULD BE A STRING')
	}

	static refreshToken(location: TLocation) {
		return location('refreshToken')
			.isString()
			.withMessage('SHOULD BE A STRING')
			.not()
			.isEmpty()
			.withMessage('SHOULD BE A STRING')
	}

	static isArchived(location: TLocation) {
		return BasicValidator.booleanOptional(location, 'isArchived')
	}

	static isBanned(location: TLocation) {
		return BasicValidator.booleanOptional(location, 'isBanned')
	}
}
