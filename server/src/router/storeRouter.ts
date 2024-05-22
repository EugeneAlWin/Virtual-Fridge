import { create } from '@server/services/product'
import { getInfo, setProducts } from '@server/services/storage'
import { Elysia, t } from 'elysia'

export const storeRouter = (app: Elysia<'/store'>) =>
	app
		.get('/:creatorId', ({ params }) => getInfo(params.creatorId), {
			params: t.Object({ creatorId: t.String() }),
		})
		//TODO remove test route
		.post('/', () =>
			create({
				creatorId: 'fd',
				title: 'sdf',
				calories: 3,
				fats: 3,
				carbohydrates: 4,
				isFrozen: false,
				isOfficial: false,
				protein: 5,
				unit: 'GRAMS',
				isRecipePossible: false,
			})
		)
		.patch('/patch', ({ body }) => setProducts(body), {
			body: t.Array(
				t.Object({
					expireDate: t.Date({ examples: new Date() }),
					storeId: t.String(),
					productId: t.String(),
					purchaseDate: t.Optional(t.Date({ examples: new Date() })),
					productQuantity: t.Number(),
				})
			),
		})
