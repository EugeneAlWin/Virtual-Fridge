import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { exit } from 'node:process'
import { CONFIG } from './config'
import errorMiddleware from './middlewares/errorMiddleware'
import prismaClient from './prismaClient'
import checklistRouter from './router/checklistRouter'
import productRouter from './router/productRouter'
import recipeRouter from './router/recipeRouter'
import storeRouter from './router/storeRouter'
import userRouter from './router/userRouter'
import UserEndpoints from './api/users/endpoints'
import ProductEndpoints from './api/products/endpoints'
import ChecklistEndpoints from './api/checklists/endpoints'
import StoreEndpoints from './api/stores/endpoints'
import RecipeEndpoints from './api/recipes/endpoints'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({ credentials: true, origin: CONFIG.CLIENT_URL }))

app.use(UserEndpoints.BASE, userRouter)
app.use(ProductEndpoints.BASE, productRouter)
app.use(ChecklistEndpoints.BASE, checklistRouter)
app.use(StoreEndpoints.BASE, storeRouter)
app.use(RecipeEndpoints.BASE, recipeRouter)
app.use(errorMiddleware)

const main = async () => {
	try {
		await prismaClient.$connect()
		app.listen(CONFIG.PORT, () =>
			console.log(`Server started on port ${CONFIG.PORT}`)
		)
	} catch (e) {
		console.error('Connection error. Stopping process...')
		await prismaClient.$disconnect()
		console.error(e)
	}
}

main().catch(() => console.log('Process stopped'))

process.on('SIGINT', async () => {
	await prismaClient.$disconnect()
	console.log('Disconnected with SIGINT')
	exit(0)
})
