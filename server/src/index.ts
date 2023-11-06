import express from 'express'
import prismaClient from './prismaClient'
import { CONFIG } from './config'
import userRouter from './router/userRouter'
import errorMiddleware from './middlewares/errorMiddleware'

const app = express()

app.use(express.json())

app.use('/users', userRouter)
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
