import { Router } from 'express'
import { body, query } from 'express-validator'
import StoreEndpoints from '../api/stores/endpoints'
import StoreController from '../controllers/storeController'
import StoreDataValidator from '../validators/storeDataValidator'
import authMiddleware from '../middlewares/authMiddleware'

const storeRouter = Router()

storeRouter.get(
	StoreEndpoints.GET_BY_ID,
	authMiddleware,
	StoreDataValidator.creatorId(query),
	StoreController.getStoreById
)

storeRouter.patch(
	StoreEndpoints.UPDATE,
	authMiddleware,
	StoreDataValidator.id(body),
	StoreDataValidator.title(body, true, { max: 50 }),
	StoreDataValidator.StoreCompositionArrayEntries(body),
	StoreController.updateStoreData
)

export default storeRouter
