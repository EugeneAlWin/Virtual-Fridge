import { Roles } from '@prisma/client'

export const rolesConverter: Record<Roles, string> = {
	[Roles.ADMIN]: 'Модератор',
	[Roles.GOD]: 'Администратор',
	[Roles.DEFAULT]: 'Обычный пользователь',
}
