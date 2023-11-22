import { sign, verify } from 'jsonwebtoken'
import { Roles } from '../api/enums'
import { CONFIG } from '../config'

export default class Tokenizator {
	static generateTokens({
		login,
		role,
		deviceId,
	}: {
		login: string
		role: keyof typeof Roles
		deviceId: string
	}) {
		const accessToken = sign({ login, role, deviceId }, CONFIG.JWT_ACCESS, {
			expiresIn: '30m',
			algorithm: 'HS512',
		})
		const refreshToken = sign({ login, role, deviceId }, CONFIG.JWT_REFRESH, {
			expiresIn: '15d',
			algorithm: 'HS512',
		})

		return { accessToken, refreshToken }
	}

	static validateAccessToken(token: string) {
		try {
			return verify(token, CONFIG.JWT_ACCESS)
		} catch (e) {
			return null
		}
	}

	static validateRefreshToken(token: string) {
		try {
			return verify(token, CONFIG.JWT_REFRESH)
		} catch (e) {
			return null
		}
	}
}
