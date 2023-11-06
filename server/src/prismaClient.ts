import { PrismaClient } from 'prisma/prisma-client'

const prismaClient = new PrismaClient({
	errorFormat: 'minimal',
	log: ['info', 'warn', 'error'],
})

export default prismaClient
