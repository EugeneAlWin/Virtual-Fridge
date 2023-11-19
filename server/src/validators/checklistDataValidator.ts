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
			BasicValidator.isArray(location, 'checklistComposition'),
			BasicValidator.id(location, 'checklistComposition[*].productId'),
			location('checklistComposition[*].quantity')
				.not()
				.isString()
				.withMessage('SHOULD BE NUMERIC > 0'),
			location('checklistComposition[*].units')
				.isString()
				.withMessage('SHOULD BE STRING')
				.isIn(Object.values(Units))
				.withMessage(`ALLOWED VALUES: ${Object.values(Units).join(' | ')}`),
			BasicValidator.decimal(location, 'checklistComposition[*].price'),
			location('checklistComposition[*].currency')
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
			BasicValidator.decimal(location, 'checklistPrices.BYN'),
			BasicValidator.decimal(location, 'checklistPrices.USD'),
			BasicValidator.decimal(location, 'checklistPrices.RUB'),
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
