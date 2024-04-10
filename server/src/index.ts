// import cookieParser from 'cookie-parser'
import { treaty } from '@elysiajs/eden'
import swagger from '@elysiajs/swagger'
import { Elysia } from 'elysia'
import { exit } from 'node:process'
// import cors from 'cors'
// import { exit } from 'node:process'
import { CONFIG } from './config'
import prismaClient from './prismaClient'
import { storeRouter } from './router/storeRouter'
// import errorMiddleware from './middlewares/errorMiddleware'
// import prismaClient from './prismaClient'
// import checklistRouter from './router/checklistRouter'
// import productRouter from './router/productRouter'
// import recipeRouter from './router/recipeRouter'
// import storeRouter from './router/storeRouter'
// import userRouter from './router/userRouter'
// import UserEndpoints from './api/users/endpoints'
// import ProductEndpoints from './api/products/endpoints'
// import ChecklistEndpoints from './api/checklists/endpoints'
// import StoreEndpoints from './api/stores/endpoints'
// import RecipeEndpoints from './api/recipes/endpoints'

// const app = express()
// app.use(express.json())
// app.use(cookieParser())
// app.use(
// 	cors({
// 		credentials: true,
// 		origin: CONFIG.CLIENT_URL,
// 	})
// )

// app.use(UserEndpoints.BASE, userRouter)
// app.use(ProductEndpoints.BASE, productRouter)
// app.use(ChecklistEndpoints.BASE, checklistRouter)
// app.use(StoreEndpoints.BASE, storeRouter)
// app.use(RecipeEndpoints.BASE, recipeRouter)
// app.use(errorMiddleware)
const app = new Elysia()
	.group('/stores', storeRouter)
	.onError(({ error }) => error)
	.use(swagger())
	.listen(CONFIG.PORT, () =>
		console.log(`Server started on port ${CONFIG.PORT}`)
	)

export type ElysiaApp = typeof app

const main = async () => {
	try {
		await prismaClient.$connect()
		const client = treaty<ElysiaApp>('localhost:3000')
		const p = await client.stores({ creatorId: 1 }).get()
		console.log(p)
		// return p.data?.storeComposition
	} catch (e) {
		console.error('Connection error. Stopping process...')
		await prismaClient.$disconnect()
		console.error(e)
	}
}
// type App = typeof app
main()
	.then(async () => {})
	.catch(() => console.log('Process stopped'))

process.on('SIGINT', async () => {
	await prismaClient.$disconnect()
	console.log('Disconnected with SIGINT')
	exit(0)
})
