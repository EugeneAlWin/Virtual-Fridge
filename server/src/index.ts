import express from 'express'
import { CONFIG } from './config'
import errorMiddleware from './middlewares/errorMiddleware'
import prismaClient from './prismaClient'
import checklistRouter from './router/checklistRouter'
import productRouter from './router/productRouter'
import userRouter from './router/userRouter'

const app = express()

app.use(express.json())

app.use('/users', userRouter)
app.use('/products', productRouter)
app.use('/checklists', checklistRouter)
app.use(errorMiddleware)

const main = () => {
	try {
		app.listen(CONFIG.PORT, () =>
			console.log(`Server started on port ${CONFIG.PORT}`)
		)
	} catch (e) {
		prismaClient.$disconnect()
		console.log(e)
		process.exit(1)
	}
}

main()

process.on('SIGINT', () => {
	prismaClient.$disconnect()
	console.log('Disconnected')
	process.exit(0)
})
