import { body, param, query } from 'express-validator'
import { Roles } from '../api/enums'

type TLocation = typeof body | typeof param | typeof query

export default class UserDataValidator {
	static login(
		location: TLocation,
		isOptional: boolean = false,
		length: { min?: number; max: number } | undefined = undefined
	) {
		const result = isOptional
			? location('login').optional({ values: 'undefined' })
			: location('login')
					.isString()
					.withMessage('SHOULD BE A STRING')

		return length
			? result
					.isLength({
						min: length.min || 0,
						max: length.max,
					})
					.withMessage(
						`${length?.min || 0} >= LENGTH <= ${length?.max}`
					)
			: result
	}

	static password(
		location: TLocation,
		isOptional: boolean = false,
		length: { min?: number; max: number } | undefined = undefined
	) {
		const result = isOptional
			? location('password').optional({ values: 'undefined' })
			: location('password')
					.isString()
					.withMessage('SHOULD BE A STRING')

		return length
			? result
					.isLength({
						min: length.min || 0,
						max: length.max,
					})
					.withMessage(
						`${length?.min || 0} >= LENGTH <= ${length?.max}`
					)
			: result
	}

	static take(location: TLocation) {
		return location('take')
			.not()
			.isString()
			.withMessage('SHOULD BE AN INTEGER >= 0')
			.isInt({ min: 0 })
			.withMessage('SHOULD BE AN INTEGER >= 0')
	}

	static skip(location: TLocation) {
		return location('skip')
			.not()
			.isString()
			.withMessage('SHOULD BE AN INTEGER >= 0')
			.isInt({ min: 0 })
			.withMessage('SHOULD BE AN INTEGER >= 0')
	}

	static cursor(location: TLocation) {
		return location('cursor')
			.optional({ values: 'undefined' })
			.default(undefined)
			.not()
			.isString()
			.withMessage('SHOULD BE AN INTEGER >= 0')
			.isInt({ min: 0 })
			.withMessage('SHOULD BE AN INTEGER >= 0')
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
		return location('isArchived')
			.optional({ values: 'undefined' })
			.not()
			.isString()
			.withMessage('SHOULD BE BOOLEAN')
			.isBoolean()
			.withMessage('SHOULD BE BOOLEAN')
	}

	static isBanned(location: TLocation) {
		return location('isBanned')
			.optional({ values: 'undefined' })
			.not()
			.isString()
			.withMessage('SHOULD BE BOOLEAN')
			.isBoolean()
			.withMessage('SHOULD BE BOOLEAN')
	}
}
