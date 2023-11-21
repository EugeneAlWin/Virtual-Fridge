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

const app = express()

app.use(express.json())

app.use('/users', userRouter)
app.use('/products', productRouter)
app.use('/checklists', checklistRouter)
app.use('/stores', storeRouter)
app.use('/recipes', recipeRouter)
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
