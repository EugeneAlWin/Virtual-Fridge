import { TLocation } from './types'
import BasicValidator from './basicValidator'
import { Currencies, Units } from '../api/enums'

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
		length: { min?: number; max: number } | undefined = undefined
	) {
		return BasicValidator.title(location, isOptional, length, 'title')
	}

	static StoreCompositionArrayEntries(
		location: TLocation,
		isUpdate: boolean = false
	) {
		return [
			BasicValidator.isArray(location, 'storeComposition'),
			BasicValidator.id(location, 'storeComposition[*].productId'),
			isUpdate
				? StoreDataValidator.storeId(location)
				: StoreDataValidator.storeId(location).optional({
						values: 'undefined',
				  }),
			location('storeComposition[*].quantity')
				.isInt({ min: 0 })
				.withMessage('SHOULD BE NUMERIC > 0')
				.toInt(),
			location('storeComposition[*].unit')
				.isString()
				.withMessage('SHOULD BE STRING')
				.isIn(Object.values(Units))
				.withMessage(`ALLOWED VALUES: ${Object.values(Units).join(' | ')}`),
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
