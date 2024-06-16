export const Roles = {
	ADMIN: 'ADMIN',
	DEFAULT: 'DEFAULT',
	GOD: 'GOD',
} as const
export type Roles = (typeof Roles)[keyof typeof Roles]

export const RecipeTypes = {
	VEGETARIAN_DISHES: 'VEGETARIAN_DISHES',
	BAKING: 'BAKING',
	GARNISHES: 'GARNISHES',
	HOT_DISHES: 'HOT_DISHES',
	HOT_APPETIZERS: 'HOT_APPETIZERS',
	DESSERTS: 'DESSERTS',
	HOME_MADE_FASTFOOD: 'HOME_MADE_FASTFOOD',
	BREAKFAST: 'BREAKFAST',
	PRESERVES: 'PRESERVES',
	CHARCOAL: 'CHARCOAL',
	BEVERAGES: 'BEVERAGES',
	SALADS: 'SALADS',
	SAUCES_PASTAS_AND_DRESSINGS: 'SAUCES_PASTAS_AND_DRESSINGS',
	SOUPS_AND_BROTHS: 'SOUPS_AND_BROTHS',
	DOUGH: 'DOUGH',
	BREAD: 'BREAD',
	COLD_APPETIZERS: 'COLD_APPETIZERS',
	SHISHKEBABS: 'SHISHKEBABS',
	OTHER: 'OTHER',
} as const
export type RecipeTypes = (typeof RecipeTypes)[keyof typeof RecipeTypes]

export const Currencies = {
	USD: 'USD',
	BYN: 'BYN',
	RUB: 'RUB',
} as const
export type Currencies = (typeof Currencies)[keyof typeof Currencies]

export const Units = {
	PORTION: 'PORTION',
	ITEMS: 'ITEMS',
	GRAMS: 'GRAMS',
	KILOGRAMS: 'KILOGRAMS',
	PIECES: 'PIECES',
	TABLESPOON: 'TABLESPOON',
	TEASPOON: 'TEASPOON',
	LITER: 'LITER',
	MILLILITER: 'MILLILITER',
	PINCH: 'PINCH',
} as const
export type Units = (typeof Units)[keyof typeof Units]

export const Status = {
	PENDING: 'PENDING',
	REJECTED: 'REJECTED',
	ACCEPTED: 'ACCEPTED',
} as const
export type Status = (typeof Status)[keyof typeof Status]
