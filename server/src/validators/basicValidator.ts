import { TLocation } from './types'

export default class BasicValidator {
	static id(location: TLocation, field: string = 'id') {
		return location(field)
			.not()
			.isString()
			.withMessage('SHOULD BE AN INTEGER >= 0')
			.isInt({ min: 0 })
			.withMessage('SHOULD BE AN INTEGER >= 0')
	}

	static ids(location: TLocation, field: string) {
		return [
			location(field)
				.isArray()
				.withMessage('SHOULD BE AN ARRAY OF INTEGERS'),
			location(`${field}.*`)
				.not()
				.isString()
				.withMessage('SHOULD BE AN ARRAY OF INTEGERS')
				.isInt()
				.withMessage('SHOULD BE AN ARRAY OF INTEGERS'),
		]
	}

	static title(
		location: TLocation,
		isOptional: boolean = true,
		length: { min?: number; max: number } | undefined = undefined,
		field: string = 'title'
	) {
		const result = isOptional
			? location(field).optional({ values: 'undefined' })
			: location(field).isString().withMessage('SHOULD BE A STRING')

		return length
			? result
					.isLength({
						min: length.min || 0,
						max: length.max,
					})
					.withMessage(`${length?.min || 0} >= LENGTH <= ${length?.max}`)
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

	static isArray(location: TLocation, field: string) {
		return location(field).isArray().withMessage('SHOULD BE AN ARRAY')
	}

	static decimal(location: TLocation, field: string) {
		return location(field)
			.isString()
			.withMessage('SHOULD BE STRING')
			.isDecimal()
			.withMessage('SHOULD BE DECIMAL STRING')
	}

	static date(location: TLocation, field: string) {
		return location(field).isDate().withMessage('INVALID DATE')
	}

	static booleanOptional(location: TLocation, field: string) {
		return location(field)
			.optional({ values: 'undefined' })
			.not()
			.isString()
			.withMessage('SHOULD BE BOOLEAN')
			.isBoolean({ strict: true })
			.withMessage('SHOULD BE BOOLEAN')
	}
}
