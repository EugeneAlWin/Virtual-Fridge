import 'dotenv/config'
import * as process from 'process'

export const CONFIG = {
	PORT: process.env.PORT || 3000,
	JWT_ACCESS: process.env.JWT_ACCESS || 'AcCeSs',
	JWT_REFRESH: process.env.JWT_REFRESH || 'ReFrEsH',
}
