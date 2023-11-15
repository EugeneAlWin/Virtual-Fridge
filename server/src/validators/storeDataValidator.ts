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
		return BasicValidator.title(
			location,
			isOptional,
			length,
			'title'
		)
	}

	static StoreCompositionArrayEntries(
		location: TLocation,
		isUpdate: boolean = false
	) {
		return [
			BasicValidator.isArray(location, 'StoreComposition'),
			BasicValidator.id(location, 'StoreComposition[*].productId'),
			isUpdate
				? StoreDataValidator.storeId(location)
				: StoreDataValidator.storeId(location).optional({
						values: 'undefined',
				  }),
			location('StoreComposition[*].quantity')
				.not()
				.isString()
				.withMessage('SHOULD BE NUMERIC > 0'),
			location('StoreComposition[*].unit')
				.isString()
				.withMessage('SHOULD BE STRING')
				.isIn(Object.values(Units))
				.withMessage(
					`ALLOWED VALUES: ${Object.values(Units).join(' | ')}`
				),
			BasicValidator.decimal(
				location,
				'StoreComposition[*].price'
			),
			location('StoreComposition[*].currency')
				.isString()
				.withMessage('SHOULD BE STRING')
				.isIn(Object.values(Currencies))
				.withMessage(
					`ALLOWED VALUES: ${Object.values(Currencies).join(
						' | '
					)}`
				),
			location('StoreComposition[*].expires')
				.optional({ values: 'undefined' })
				.isDate()
				.withMessage('MUST BE DATE FORMAT'),
		]
	}
}
