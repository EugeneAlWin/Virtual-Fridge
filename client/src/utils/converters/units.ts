import { Units } from '@prisma/client'

export const unitsConverter: Record<Units, string> = {
	[Units.GRAMS]: 'Грамм',
	[Units.LITER]: 'Литры',
	[Units.PINCH]: 'Пинты',
	[Units.PIECES]: 'Куски',
	[Units.KILOGRAMS]: 'Килограмм',
	[Units.MILLILITER]: 'Миллилитр',
	[Units.TABLESPOON]: 'Столовых ложек',
	[Units.TEASPOON]: 'Чайные ложки',
	[Units.ITEMS]: 'Штук',
	[Units.PORTION]: 'Порция',
}
