import { RecipeTypes } from '~shared/enums'

export const recipeTypesConverter: Record<RecipeTypes, string> = {
	[RecipeTypes.VEGETARIAN_DISHES]: 'Вегетарианское блюдо',
	[RecipeTypes.BAKING]: 'Выпечка',
	[RecipeTypes.GARNISHES]: 'Гарниры',
	[RecipeTypes.HOT_DISHES]: 'Горячие блюда',
	[RecipeTypes.HOT_APPETIZERS]: 'Горячие закуски',
	[RecipeTypes.DESSERTS]: 'Десерты',
	[RecipeTypes.HOME_MADE_FASTFOOD]: 'Домашний фастфуд',
	[RecipeTypes.BREAKFAST]: 'Завтрак',
	[RecipeTypes.PRESERVES]: 'Заготовки',
	[RecipeTypes.CHARCOAL]: 'На углях',
	[RecipeTypes.BEVERAGES]: 'Напитки',
	[RecipeTypes.SALADS]: 'Салаты',
	[RecipeTypes.SAUCES_PASTAS_AND_DRESSINGS]: 'Соусы, пасты, приправы',
	[RecipeTypes.SOUPS_AND_BROTHS]: 'Супы и бульоны',
	[RecipeTypes.DOUGH]: 'Тесто',
	[RecipeTypes.BREAD]: 'Хлеб',
	[RecipeTypes.COLD_APPETIZERS]: 'Холодные закуски',
	[RecipeTypes.SHISHKEBABS]: 'Шашлыки',
	[RecipeTypes.OTHER]: 'Другое',
}
