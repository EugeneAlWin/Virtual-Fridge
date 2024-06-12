import {
	_delete,
	confirm,
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
				cursor: t.Optional(t.String()),
				createdAt: t.Optional(t.Date()),
				take: t.Optional(t.Numeric()),
			}),
		})
		.post('/', ({ body }) => create(body), {
			body: t.Object({
				userId: t.String(),
				subtractStorage: t.Boolean(),
				recipesId: t.Array(t.String()),
			}),
		})
		.patch('/', ({ body }) => update(body), {
			body: t.Object({
				userId: t.String(),
				checklistId: t.String(),
				products: t.Array(
					t.Object({
						id: t.String(),
						quantity: t.Number(),
					})
				),
			}),
		})
		.patch('/confirm', ({ body }) => confirm(body), {
			body: t.Object({
				userId: t.String(),
				checklistId: t.String(),
			}),
		})
		.delete('/drop/:id', ({ params }) => _delete(params.id), {
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
