import { Roles } from '../api/enums'
import { sign, verify } from 'jsonwebtoken'
import { CONFIG } from '../config'

export default class Tokenizator {
	static generateTokens(payload: {
		login: string
		password: string
		role: keyof typeof Roles
		deviceId: string
	}) {
		const accessToken = sign(payload, CONFIG.JWT_ACCESS, {
			expiresIn: '3d',
			algorithm: 'HS512',
		})
		const refreshToken = sign(payload, CONFIG.JWT_REFRESH, {
			expiresIn: '10d',
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
