import { Units } from '@prisma/client'
import {
	_delete,
	checkRefs,
	create,
	getAll,
	getMany,
	getOne,
	update,
} from '@server/services/product'
import { Elysia, t } from 'elysia'

export const products = (app: ProductRouterType) =>
	app
		.get('/:id', ({ params }) => getOne(params.id), {
			params: t.Object({ id: t.String() }),
		})
		.get('/many', ({ query }) => getMany(query.ids), {
			query: t.Object({ ids: t.Array(t.String()) }),
		})
		.get('/', ({ query }) => getAll(query), {
			query: t.Object({
				cursor: t.Nullable(t.String()),
				createdAt: t.Optional(t.Date()),
				take: t.Optional(t.Number()),
			}),
		})
		.post('/', ({ body }) => create(body), {
			body: t.Object({
				creatorId: t.String(),
				title: t.String(),
				calories: t.Number(),
				protein: t.Number(),
				fats: t.Number(),
				carbohydrates: t.Number(),
				isOfficial: t.Boolean(),
				isFrozen: t.Boolean(),
				isRecipePossible: t.Boolean(),
				averageShelfLifeInDays: t.Optional(t.Number()),
				unit: t.Enum(Units, { default: Units.GRAMS }),
			}),
		})
		.patch('/', ({ body }) => update(body), {
			body: t.Object({
				id: t.String(),
				creatorId: t.String(),
				title: t.Optional(t.String()),
				calories: t.Optional(t.Number()),
				protein: t.Optional(t.Number()),
				fats: t.Optional(t.Number()),
				carbohydrates: t.Optional(t.Number()),
				isOfficial: t.Optional(t.Boolean()),
				isFrozen: t.Optional(t.Boolean()),
				isRecipePossible: t.Optional(t.Boolean()),
				averageShelfLifeInDays: t.Optional(t.Number()),
				unit: t.Optional(t.Enum(Units, { default: Units.GRAMS })),
			}),
		})
		.delete('/:id', ({ params }) => _delete(params.id), {
			params: t.Object({ id: t.String() }),
		})
		.get('/refs', ({ query }) => checkRefs(query.id), {
			query: t.Object({ id: t.String() }),
		})

type ProductRouterType = Elysia<
	'/products',
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
