import { PrismaClient } from '@prisma/client/index'

export const publicDBClient = new PrismaClient({
	errorFormat: 'minimal',
	log: ['info', 'warn', 'error'],
})
