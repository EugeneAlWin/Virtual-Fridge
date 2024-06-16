import { Units } from '~shared/enums'

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

// import { $Enums } from '@prisma/client'
//
// export const unitsConverter: Record<$Enums.Units, string> = {
// 	[$Enums.Units.GRAMS]: 'Грамм',
// 	[$Enums.Units.LITER]: 'Литры',
// 	[$Enums.Units.PINCH]: 'Пинты',
// 	[$Enums.Units.PIECES]: 'Куски',
// 	[$Enums.Units.KILOGRAMS]: 'Килограмм',
// 	[$Enums.Units.MILLILITER]: 'Миллилитр',
// 	[$Enums.Units.TABLESPOON]: 'Столовых ложек',
// 	[$Enums.Units.TEASPOON]: 'Чайные ложки',
// 	[$Enums.Units.ITEMS]: 'Штук',
// 	[$Enums.Units.PORTION]: 'Порция',
// }
