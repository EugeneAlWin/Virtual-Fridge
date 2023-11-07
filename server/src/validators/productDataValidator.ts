import { TLocation } from './types'
import BasicValidator from './basicValidator'

export default class ProductDataValidator extends BasicValidator {
	static creatorId(location: TLocation) {
		return BasicValidator.id(location, 'creatorId')
	}

	static productId(location: TLocation, isArray = false) {
		return isArray
			? location('productId')
					.isArray()
					.withMessage('SHOULD BE AN ARRAY OF INTEGERS')
			: location('productId')
					.not()
					.isString()
					.withMessage('SHOULD BE AN INTEGER')
					.isInt({ min: 0 })
					.withMessage('SHOULD BE AN INTEGER >= 0')
	}

	static productIdArrayEntries(location: TLocation) {
		return location('productId.*')
			.not()
			.isString()
			.withMessage('SHOULD BE AN INTEGER')
			.isInt({ min: 0 })
			.withMessage('SHOULD BE AN INTEGER >= 0')
	}

	static title(
		location: TLocation,
		isOptional: boolean = true,
		length: { min?: number; max: number } | undefined = undefined
	) {
		return BasicValidator.title(
			location,
			isOptional,
			length,
			'title'
		)
	}

	static calories(location: TLocation, isOptional = false) {
		return isOptional
			? location('calories').optional({ values: 'undefined' })
			: location('calories')
					.not()
					.isString()
					.withMessage('SHOULD BE AN INTEGER >= 0')
					.isInt({ min: 0 })
					.withMessage('SHOULD BE AN INTEGER >= 0')
	}

	static protein(location: TLocation, isOptional = false) {
		return isOptional
			? location('protein').optional({ values: 'undefined' })
			: location('protein')
					.not()
					.isString()
					.withMessage('SHOULD BE AN INTEGER >= 0')
					.isInt({ min: 0 })
					.withMessage('SHOULD BE AN INTEGER >= 0')
	}

	static fats(location: TLocation, isOptional = false) {
		return isOptional
			? location('fats').optional({ values: 'undefined' })
			: location('fats')
					.not()
					.isString()
					.withMessage('SHOULD BE AN INTEGER >= 0')
					.isInt({ min: 0 })
					.withMessage('SHOULD BE AN INTEGER >= 0')
	}

	static carbohydrates(location: TLocation, isOptional = false) {
		return isOptional
			? location('carbohydrates').optional({ values: 'undefined' })
			: location('carbohydrates')
					.not()
					.isString()
					.withMessage('SHOULD BE AN INTEGER >= 0')
					.isInt({ min: 0 })
					.withMessage('SHOULD BE AN INTEGER >= 0')
	}
}