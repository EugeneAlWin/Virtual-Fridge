import {
	addProductToStorage,
	getComposition,
	getInfo,
	removeProductFromStorage,
	setComposition,
	setInfo,
} from '@server/services/storage'
import { Elysia, t } from 'elysia'

export const storages = (app: StorageRouterType) =>
	app
		.get('/', ({ query }) => getInfo(query.creatorId), {
			query: t.Object({ creatorId: t.String() }),
		})
		.get('/composition', ({ query }) => getComposition(query), {
			query: t.Object({
				storageId: t.String(),
				cursor: t.Optional(
					t.Object({
						productId: t.String(),
						expireDate: t.Date(),
						storageId: t.String(),
					})
				),
				take: t.Optional(t.Numeric()),
			}),
		})
		.patch('/', ({ query }) => setInfo(query), {
			query: t.Object({ storageId: t.String(), title: t.String() }),
		})
		.patch('/composition', ({ body }) => setComposition(body), {
			body: t.Array(
				t.Object({
					expireDate: t.Optional(t.Date({ examples: new Date() })),
					storageId: t.String(),
					productId: t.String(),
					purchaseDate: t.Optional(t.Date({ examples: new Date() })),
					productQuantity: t.Number(),
				})
			),
		})
		.put('/add', ({ body }) => addProductToStorage(body), {
			body: t.Object({
				storageId: t.String(),
				productId: t.String(),
				productQuantity: t.Numeric({ minimum: 0 }),
				expireDate: t.Optional(
					t.Date({
						default: new Date('1970-01-01T00:00:00.00Z'),
					})
				),
			}),
		})
		.delete('/remove', ({ body }) => removeProductFromStorage(body), {
			body: t.Object({
				storageId: t.String(),
				productId: t.String(),
			}),
		})

type StorageRouterType = Elysia<
	'/storages',
	false,
	{
		decorator: NonNullable<unknown>
		store: NonNullable<unknown>
		derive: NonNullable<unknown>
		resolve: NonNullable<unknown>
	},
	{ type: NonNullable<unknown>; error: NonNullable<unknown> },
	{ schema: NonNullable<unknown>; macro: NonNullable<unknown> },
	NonNullable<unknown>,
	{
		derive: NonNullable<unknown>
		resolve: NonNullable<unknown>
		schema: NonNullable<unknown>
	},
	{
		derive: NonNullable<unknown>
		resolve: NonNullable<unknown>
		schema: NonNullable<unknown>
		decorator: NonNullable<unknown>
		store: NonNullable<unknown>
	}
>
