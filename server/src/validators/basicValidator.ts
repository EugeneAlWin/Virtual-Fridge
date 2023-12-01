import { TLocation } from './types'

export default class BasicValidator {
	static id(location: TLocation, field: string = 'id') {
		return location(field)
			.isInt({ min: 0 })
			.withMessage('SHOULD BE AN INTEGER >= 0')
			.toInt()
	}

	static ids(location: TLocation, field: string) {
		return [
			location(field)
				.isArray()
				.withMessage('SHOULD BE AN ARRAY OF INTEGERS'),
			location(`${field}.*`)
				.isInt()
				.withMessage('SHOULD BE AN ARRAY OF INTEGERS')
				.toInt(),
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
			.isInt({ min: 0 })
			.withMessage('SHOULD BE AN INTEGER >= 0')
			.toInt()
	}

	static skip(location: TLocation) {
		return location('skip')
			.isInt({ min: 0 })
			.withMessage('SHOULD BE AN INTEGER >= 0')
			.toInt()
	}

	static cursor(location: TLocation) {
		return location('cursor')
			.optional({ values: 'undefined' })
			.default(undefined)
			.isInt({ min: 0 })
			.withMessage('SHOULD BE AN INTEGER >= 0')
			.toInt()
	}

	static isArray(location: TLocation, field: string) {
		return location(field).isArray().withMessage('SHOULD BE AN ARRAY')
	}

	static decimal(location: TLocation, field: string) {
		return location(field)
			.isDecimal()
			.withMessage('SHOULD BE DECIMAL STRING')
			.toFloat()
	}

	static date(location: TLocation, field: string) {
		return location(field).isDate().withMessage('INVALID DATE')
	}

	static booleanOptional(location: TLocation, field: string) {
		return location(field)
			.optional({ values: 'undefined' })
			.isBoolean()
			.withMessage('SHOULD BE BOOLEAN')
			.toBoolean(true)
	}
}
