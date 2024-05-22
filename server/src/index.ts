import swagger from '@elysiajs/swagger'
import { CONFIG } from '@server/config'
import { publicDBClient } from '@server/prismaClients'
import { storeRouter } from '@server/router/storeRouter'
import { Elysia } from 'elysia'
import { exit } from 'node:process'

const app = new Elysia()
	.onError(e => console.log(e))
	.group('/store', storeRouter)
	.use(swagger())
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
