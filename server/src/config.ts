import 'dotenv/config'

export const CONFIG = {
	PORT: process.env.PORT || 3000,
	JWT_ACCESS: process.env.JWT_ACCESS || 'AcCeSs',
	JWT_REFRESH: process.env.JWT_REFRESH || 'ReFrEsH',
	CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3001',
}
