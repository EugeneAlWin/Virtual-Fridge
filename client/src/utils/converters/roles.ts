import { Roles } from '~shared/enums'

export const rolesConverter: Record<Roles, string> = {
	[Roles.ADMIN]: 'Модератор',
	[Roles.GOD]: 'Администратор',
	[Roles.DEFAULT]: 'Обычный пользователь',
}
