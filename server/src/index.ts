import swagger from '@elysiajs/swagger'
import { CONFIG } from '@server/config'
import { publicDBClient } from '@server/prismaClients'
import { stores } from '@server/router/stores'
import { users } from '@server/router/users'
import { Elysia } from 'elysia'

const app = new Elysia()
	.onError(e => console.log(e))
	.group('/users', users)
	.group('/stores', stores)
	.use(swagger())

await publicDBClient.$connect()

app.listen(CONFIG.PORT, () =>
	console.log(`Server started on port ${CONFIG.PORT}`)
)

export type VF_API_ROUTER_TYPES = typeof app

process.on('SIGINT', async () => {
	await publicDBClient.$disconnect()
	console.log('SIGINT received')
	process.exit(0)
})
