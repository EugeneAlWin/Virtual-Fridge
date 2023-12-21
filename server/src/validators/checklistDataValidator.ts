import { Currencies } from '../api/enums'
import BasicValidator from './basicValidator'
import { TLocation } from './types'

export default class ChecklistDataValidator extends BasicValidator {
	static creatorId(location: TLocation) {
		return BasicValidator.id(location, 'creatorId')
	}

	static checklistId(location: TLocation) {
		return BasicValidator.id(location, 'checklistId')
	}

	static isConfirmed(location: TLocation) {
		return BasicValidator.booleanOptional(location, 'isConfirmed')
	}

	static createdAt(location: TLocation) {
		return BasicValidator.date(location, 'createdAt').optional({
			values: 'undefined',
		})
	}

	static ChecklistCompositionArrayEntries(location: TLocation) {
		return [
			BasicValidator.isArray(location, 'checklistComposition').optional({
				values: 'undefined',
			}),
			BasicValidator.id(
				location,
				'checklistComposition[*].productId'
			).optional({ values: 'undefined' }),
			location('checklistComposition[*].quantity')
				.optional({ values: 'undefined' })
				.isInt({ max: 30000, min: 0 })
				.withMessage('SHOULD BE INT >= 0 AND <= 30000')
				.toInt(),
			BasicValidator.decimal(
				location,
				'checklistComposition[*].price'
			).optional({ values: 'undefined' }),
			location('checklistComposition[*].currency')
				.optional({ values: 'undefined' })
				.isString()
				.withMessage('SHOULD BE STRING')
				.isIn(Object.values(Currencies))
				.withMessage(
					`ALLOWED VALUES: ${Object.values(Currencies).join(' | ')}`
				),
		]
	}

	static ChecklistPricesEntries(location: TLocation) {
		return [
			BasicValidator.decimal(location, 'checklistPrices.BYN').optional(),
			BasicValidator.decimal(location, 'checklistPrices.USD').optional(),
			BasicValidator.decimal(location, 'checklistPrices.RUB').optional(),
		]
	}

	static checklistsIdArray(location: TLocation) {
		return [
			location('checklistsId')
				.isArray()
				.withMessage('SHOULD BE AN ARRAY OF NUMBERS >= 0'),
			location('checklistsId.*')
				.isInt({ min: 0 })
				.withMessage('SHOULD BE AN ARRAY OF NUMBERS >= 0')
				.toInt(),
		]
	}
}
