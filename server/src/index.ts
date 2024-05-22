import swagger from '@elysiajs/swagger'
import { publicDBClient } from '@server/prismaClients'
import { storeRouter } from '@server/router/storeRouter'
import { Elysia } from 'elysia'
import { exit } from 'node:process'
import { CONFIG } from './config'

const app = new Elysia()
	.group('/store', storeRouter)
	.use(swagger())
	.onError(e => console.log(e))

try {
	await publicDBClient.$connect()

	app.listen(CONFIG.PORT, () =>
		console.log(`Server started on port ${CONFIG.PORT}`)
	)
} catch (e) {
	console.error('Connection error. Stopping process...')
	await publicDBClient.$disconnect()
	console.error(e)
}
export type VF_API_ROUTER_TYPES = typeof app

process.on('SIGINT', async () => {
	await publicDBClient.$disconnect()
	console.log('SIGINT received')
	exit(0)
})
