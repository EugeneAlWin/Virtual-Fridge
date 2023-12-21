import { RecipeTypes } from '../api/enums'
import BasicValidator from './basicValidator'
import { TLocation } from './types'

export default class RecipeDataValidator extends BasicValidator {
	static userId(location: TLocation) {
		return BasicValidator.id(location, 'userId')
	}

	static recipeId(location: TLocation) {
		return BasicValidator.id(location, 'recipeId')
	}

	static title(
		location: TLocation,
		isOptional: boolean = true,
		length: { min?: number; max: number } | undefined = undefined
	) {
		return BasicValidator.title(location, isOptional, length, 'title')
	}

	static type(location: TLocation, isOptional: boolean) {
		const result = location('type')
			.isString()
			.withMessage('SHOULD BE STRING')
			.isIn(Object.values(RecipeTypes))
			.withMessage(
				'ALLOWED TYPES: ' + Object.values(RecipeTypes).join(' | ')
			)
		return isOptional ? result.optional({ values: 'undefined' }) : result
	}

	static description(location: TLocation) {
		return location('description')
			.optional({ values: 'undefined', nullable: true })
			.isString()
			.withMessage('SHOULD BE STRING')
	}

	static recipeComposition(location: TLocation, isOptional: boolean = false) {
		return [
			(isOptional
				? location('recipeComposition').optional({
						values: 'undefined',
				  })
				: location('recipeComposition')
			)
				.isArray()
				.withMessage('SHOULD BE AN ARRAY'),
			location('recipeComposition.*.productId')
				.if(location('recipeComposition').isArray())
				.isInt({ min: 0 })
				.withMessage('SHOULD BE INT >= 0')
				.toInt(),
			location('recipeComposition.*.quantity')
				.if(location('recipeComposition').isArray())
				.isInt({ max: 30000, min: 0 })
				.withMessage('SHOULD BE INT >= 0 AND <= 30000')
				.toInt(),
		]
	}
}
