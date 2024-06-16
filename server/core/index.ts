import cookie from '@elysiajs/cookie'
import { cors } from '@elysiajs/cors'
import swagger from '@elysiajs/swagger'
import { CONFIG } from '@server/config'
import { publicDBClient } from '@server/prismaClients'
import { checklists } from '@server/router/checklists'
import { products } from '@server/router/products'
import { recipes } from '@server/router/recipes'
import { storages } from '@server/router/storages'
import { users } from '@server/router/users'
import { Elysia } from 'elysia'

const app = new Elysia()
	.onError(e => console.log(e))
	.use(cors({ credentials: true }))
	.use(cookie())
	.group('/users', users)
	.group('/products', products)
	.group('/recipes', recipes)
	.group('/checklists', checklists)
	.group('/storages', storages)
	.use(swagger())

await publicDBClient.$connect()

app.listen(+CONFIG.PORT, () =>
	console.log(`Server started on port ${CONFIG.PORT}`)
)

export type VF_API_ROUTER_TYPES = typeof app

process.on('SIGINT', async () => {
	await publicDBClient.$disconnect()
	console.log('SIGINT received')
	process.exit(0)
})
