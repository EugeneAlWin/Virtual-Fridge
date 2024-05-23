import { Currencies } from '@prisma/client'
import {
	_delete,
	create,
	getAll,
	getMany,
	getOne,
	update,
} from '@server/services/checklist'
import { Elysia, t } from 'elysia'

export const checklists = (app: ChecklistRouterType) =>
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
				composition: t.Array(
					t.Object({
						productId: t.String(),
						price: t.Number(),
						currency: t.Enum(Currencies, { default: Currencies.BYN }),
						productQuantity: t.Number(),
					})
				),
				info: t.Object({
					creatorId: t.String(),
					isConfirmed: t.Optional(t.Boolean()),
				}),
			}),
		})
		.patch('/', ({ body }) => update(body), {
			body: t.Object({
				composition: t.Optional(
					t.Array(
						t.Object({
							productId: t.String(),
							price: t.Number(),
							currency: t.Enum(Currencies, { default: Currencies.BYN }),
							productQuantity: t.Number(),
						})
					)
				),
				info: t.Object({
					checklistId: t.String(),
					creatorId: t.String(),
					isConfirmed: t.Optional(t.Boolean()),
				}),
			}),
		})
		.delete('/:id', ({ params }) => _delete(params.id), {
			params: t.Object({ id: t.String() }),
		})

type ChecklistRouterType = Elysia<
	'/checklists',
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
