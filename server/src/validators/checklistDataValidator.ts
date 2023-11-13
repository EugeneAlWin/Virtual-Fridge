import { Currencies, Units } from '../api/enums'
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
			BasicValidator.isArray(location, 'ChecklistComposition'),
			BasicValidator.id(
				location,
				'ChecklistComposition[*].productId'
			),
			location('ChecklistComposition[*].quantity')
				.not()
				.isString()
				.withMessage('SHOULD BE NUMERIC > 0'),
			location('ChecklistComposition[*].units')
				.isString()
				.withMessage('SHOULD BE STRING')
				.isIn(Object.values(Units))
				.withMessage(
					`ALLOWED VALUES: ${Object.values(Units).join(' | ')}`
				),
			BasicValidator.decimal(
				location,
				'ChecklistComposition[*].price'
			),
			location('ChecklistComposition[*].currency')
				.isString()
				.withMessage('SHOULD BE STRING')
				.isIn(Object.values(Currencies))
				.withMessage(
					`ALLOWED VALUES: ${Object.values(Currencies).join(
						' | '
					)}`
				),
		]
	}

	static ChecklistPricesEntries(location: TLocation) {
		return [
			BasicValidator.decimal(location, 'ChecklistPrices.BYN'),
			BasicValidator.decimal(location, 'ChecklistPrices.USD'),
			BasicValidator.decimal(location, 'ChecklistPrices.RUB'),
		]
	}

	static checklistsIdArray(location: TLocation) {
		return [
			location('checklistsId')
				.isArray()
				.withMessage('SHOULD BE AN ARRAY OF NUMBERS >= 0'),
			location('checklistsId.*')
				.isInt({ min: 0 })
				.withMessage('SHOULD BE AN ARRAY OF NUMBERS >= 0'),
		]
	}
}
