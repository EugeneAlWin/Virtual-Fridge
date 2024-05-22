export const CONFIG = {
	PORT: Bun.env.PORT || 3000,
	JWT_ACCESS: Bun.env.JWT_ACCESS || 'AcCeSs',
	JWT_REFRESH: Bun.env.JWT_REFRESH || 'ReFrEsH',
	CLIENT_URL: Bun.env.CLIENT_URL || 'http://localhost:3001',
}
