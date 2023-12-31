import { TLocation } from './types'
import BasicValidator from './basicValidator'
import { Currencies } from '../api/enums'

export default class StoreDataValidator extends BasicValidator {
	static creatorId(location: TLocation) {
		return BasicValidator.id(location, 'creatorId')
	}

	static storeId(location: TLocation) {
		return BasicValidator.id(location, 'storeId')
	}

	static title(
		location: TLocation,
		isOptional: boolean = true,
		length:
			| {
					min?: number
					max: number
			  }
			| undefined = undefined
	) {
		return BasicValidator.title(location, isOptional, length, 'title')
	}

	static StoreCompositionArrayEntries(location: TLocation) {
		return [
			BasicValidator.isArray(location, 'storeComposition'),
			BasicValidator.id(location, 'storeComposition[*].productId'),
			location('storeComposition[*].quantity')
				.isInt({ max: 30000, min: 0 })
				.withMessage('SHOULD BE INT >= 0 AND <= 30000')
				.toInt(),
			BasicValidator.decimal(location, 'storeComposition[*].price'),
			location('storeComposition[*].currency')
				.isString()
				.withMessage('SHOULD BE STRING')
				.isIn(Object.values(Currencies))
				.withMessage(
					`ALLOWED VALUES: ${Object.values(Currencies).join(' | ')}`
				),
			location('storeComposition[*].expires').optional({
				values: 'undefined',
			}),
			// .isDate()
			// .toDate()
			// .withMessage('MUST BE DATE FORMAT'),
		]
	}
}
