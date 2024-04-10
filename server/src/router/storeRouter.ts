import { Elysia, t } from 'elysia'
import { Currencies } from '../api/enums'
import StoreController from '../controllers/storeController'

// const storeRouter = Router()
//
// storeRouter.get(
// 	StoreEndpoints.GET_BY_ID,
// 	authMiddleware,
// 	StoreDataValidator.creatorId(query),
// 	StoreController.getStoreById
// )
//
// storeRouter.patch(
// 	StoreEndpoints.UPDATE,
// 	authMiddleware,
// 	StoreDataValidator.id(body),
// 	StoreDataValidator.title(body, true, { max: 50 }),
// 	StoreDataValidator.StoreCompositionArrayEntries(body),
// 	StoreController.updateStoreData
// )
export const storeRouter = (app: Elysia<'/stores'>) =>
	app
		.get(
			'/:creatorId',
			({ params }) => StoreController.getStoreById(params.creatorId),
			{
				params: t.Object({ creatorId: t.Numeric() }),
			}
		)
		.patch('/update', ({ body }) => body, {
			body: t.Object({
				id: t.Number(),
				creatorId: t.Number(),
				title: t.Optional(t.String()),
				storeComposition: t.Array(
					t.Object({
						productId: t.Number(),
						quantity: t.Number(),
						expires: t.Optional(
							t.Nullable(t.Date({ examples: new Date() }))
						),
						price: t.Number(),
						currency: t.Enum(Currencies, { default: Currencies.BYN }),
					})
				),
			}),
		})
