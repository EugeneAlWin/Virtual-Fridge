import { PrismaClient } from 'prisma/prisma-client'

export const publicDBClient = new PrismaClient({
	errorFormat: 'minimal',
	log: ['info', 'warn', 'error'],
})
