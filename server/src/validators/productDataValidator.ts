import BasicValidator from './basicValidator'
import { TLocation } from './types'

export default class ProductDataValidator extends BasicValidator {
	static creatorId(location: TLocation) {
		return BasicValidator.id(location, 'creatorId')
	}

	static productId(location: TLocation, isArray = false) {
		return isArray
			? location('productsId')
					.isArray()
					.withMessage('SHOULD BE AN ARRAY OF INTEGERS')
			: location('productId')
					.isInt({ min: 0 })
					.withMessage('SHOULD BE AN INTEGER >= 0')
					.toInt()
	}

	static productIdArrayEntries(location: TLocation) {
		return location('productsId.*')
			.isInt({ min: 0 })
			.withMessage('SHOULD BE AN INTEGER >= 0')
			.toInt()
	}

	static title(
		location: TLocation,
		isOptional: boolean = true,
		length: { min?: number; max: number } | undefined = undefined
	) {
		return BasicValidator.title(location, isOptional, length, 'title')
	}

	static calories(location: TLocation, isOptional = false) {
		return isOptional
			? location('calories')
					.optional({ values: 'undefined' })
					.isInt({ min: 0, max: 32767 })
					.withMessage('SHOULD BE AN INT >= 0 AND <= 32767')
					.toInt()
			: location('calories')
					.isInt({ min: 0, max: 32767 })
					.withMessage('SHOULD BE AN INT >= 0 AND <= 32767')
					.toInt()
	}

	static protein(location: TLocation, isOptional = false) {
		return isOptional
			? location('protein')
					.optional({ values: 'undefined' })
					.isInt({ min: 0, max: 32767 })
					.withMessage('SHOULD BE AN INT >= 0 AND <= 32767')
					.toInt()
			: location('protein')
					.isInt({ min: 0, max: 32767 })
					.withMessage('SHOULD BE AN INT >= 0 AND <= 32767')
					.toInt()
	}

	static fats(location: TLocation, isOptional = false) {
		return isOptional
			? location('fats')
					.optional({ values: 'undefined' })
					.isInt({ min: 0, max: 32767 })
					.withMessage('SHOULD BE AN INT >= 0 AND <= 32767')
					.toInt()
			: location('fats')
					.isInt({ min: 0, max: 32767 })
					.withMessage('SHOULD BE AN INT >= 0 AND <= 32767')
					.toInt()
	}

	static carbohydrates(location: TLocation, isOptional = false) {
		return isOptional
			? location('carbohydrates')
					.optional({ values: 'undefined' })
					.isInt({ min: 0, max: 32767 })
					.withMessage('SHOULD BE AN INT >= 0 AND <= 32767')
					.toInt()
			: location('carbohydrates')
					.isInt({ min: 0, max: 32767 })
					.withMessage('SHOULD BE AN INT >= 0 AND <= 32767')
					.toInt()
	}
}
