import { Router } from 'express'
import { body } from 'express-validator'
import StoreEndpoints from '../api/stores/endpoints'
import StoreController from '../controllers/storeController'
import StoreDataValidator from '../validators/storeDataValidator'

const storeRouter = Router()

storeRouter.get(
	StoreEndpoints.GET_BY_ID,
	StoreDataValidator.creatorId(body),
	StoreController.getStoreById
)

storeRouter.post(
	StoreEndpoints.CREATE,
	StoreDataValidator.creatorId(body),
	StoreDataValidator.title(body, false, { max: 50 }),
	StoreDataValidator.StoreCompositionArrayEntries(body),
	StoreController.createStore
)

storeRouter.patch(
	StoreEndpoints.UPDATE,
	StoreDataValidator.id(body),
	StoreDataValidator.title(body, true, { max: 50 }),
	StoreDataValidator.StoreCompositionArrayEntries(body),
	StoreController.updateStoreData
)

storeRouter.delete(
	StoreEndpoints.DELETE,
	StoreDataValidator.creatorId(body),
	StoreDataValidator.storeId(body),
	StoreController.deleteStore
)

export default storeRouter
