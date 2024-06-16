import { CONFIG } from '@server/config'
import { sign, verify } from 'jsonwebtoken'
import { Roles } from '~shared/enums'

export default class TokensCore {
	static generateTokens({
		login,
		role = Roles.DEFAULT,
		deviceId,
	}: {
		login: string
		role?: Roles
		deviceId: string
	}) {
		const accessToken = sign({ login, role, deviceId }, CONFIG.JWT_ACCESS, {
			expiresIn: '3d',
			algorithm: 'HS512',
		})
		const refreshToken = sign({ login, role, deviceId }, CONFIG.JWT_REFRESH, {
			expiresIn: '15d',
			algorithm: 'HS512',
		})

		return { accessToken, refreshToken }
	}

	static validateToken(token: string, type: 'JWT_ACCESS' | 'JWT_REFRESH') {
		try {
			return verify(token, CONFIG[type])
		} catch (e) {
			return null
		}
	}
}
