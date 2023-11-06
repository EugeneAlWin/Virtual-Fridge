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

	static title(
		location: TLocation,
		isOptional: boolean = true,
		length: { min?: number; max: number } | undefined = undefined,
		field: string = 'title'
	) {
		const result = isOptional
			? location(field).optional({ values: 'undefined' })
			: location(field)
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
}
