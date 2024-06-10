import { RecipeTypes } from '@prisma/client'
import {
	_delete,
	addToFavorite,
	addToSelected,
	checkRefs,
	create,
	getAll,
	getAllFavorites,
	getAllSelected,
	getMany,
	getOne,
	removeFromFavorite,
	removeFromSelected,
	update,
	updateSelected,
} from '@server/services/recipe'
import { Elysia, t } from 'elysia'

export const recipes = (app: RecipeRouterType) =>
	app
		.get('/one/:id', ({ params }) => getOne(params.id), {
			params: t.Object({ id: t.String() }),
		})
		.get('/many', ({ query }) => getMany(query.ids), {
			query: t.Object({ ids: t.Array(t.String()) }),
		})
		.get('/', ({ query }) => getAll(query), {
			query: t.Object({
				cursor: t.Optional(t.String()),
				title: t.Optional(t.String()),
				take: t.Optional(t.Numeric()),
			}),
		})
		.post('/', ({ body }) => create(body), {
			body: t.Object({
				info: t.Object({
					creatorId: t.String(),
					title: t.String(),
					type: t.Enum(RecipeTypes),
					description: t.Optional(t.String()),
					isPrivate: t.Optional(t.Boolean()),
					isOfficial: t.Optional(t.Boolean()),
					isFrozen: t.Optional(t.Boolean()),
				}),
				composition: t.Array(
					t.Object({
						productId: t.String(),
						quantity: t.Number(),
					}),
					{ minItems: 1 }
				),
			}),
		})
		.patch('/', ({ body }) => update(body), {
			body: t.Object({
				info: t.Object({
					id: t.String(),
					title: t.String(),
					type: t.Enum(RecipeTypes),
					description: t.String(),
					isPrivate: t.Optional(t.Boolean()),
					isOfficial: t.Optional(t.Boolean()),
					isFrozen: t.Optional(t.Boolean()),
				}),
				composition: t.Optional(
					t.Array(
						t.Object({
							productId: t.String(),
							quantity: t.Number(),
						}),
						{ minItems: 1 }
					)
				),
			}),
		})
		.delete('/:id', ({ params }) => _delete(params.id), {
			params: t.Object({ id: t.String() }),
		})
		.get('/refs', ({ query }) => checkRefs(query.id), {
			query: t.Object({ id: t.String() }),
		})
		.group('/favorites', app =>
			app
				.get('/', ({ query }) => getAllFavorites(query), {
					query: t.Object({
						title: t.Optional(t.String()),
						cursor: t.Object({
							userId: t.String(),
							recipeId: t.String(),
						}),
						take: t.Optional(t.Number()),
					}),
				})
				.post('/', ({ query }) => addToFavorite(query), {
					query: t.Object({ userId: t.String(), recipeId: t.String() }),
				})
				.delete('/', ({ query }) => removeFromFavorite(query), {
					query: t.Object({ userId: t.String(), recipeId: t.String() }),
				})
		)
		.group('/selected', app =>
			app
				.get('/', ({ query }) => getAllSelected(query), {
					query: t.Object({
						cursor: t.Object({
							userId: t.String(),
							recipeId: t.String(),
						}),
						take: t.Optional(t.Number()),
					}),
				})
				.post('/', ({ body }) => addToSelected(body), {
					body: t.Object({
						userId: t.String(),
						recipeId: t.String(),
						isCooked: t.Optional(t.Boolean({ default: false })),
					}),
				})
				.put('/', ({ body }) => updateSelected(body), {
					body: t.Object({
						userId: t.String(),
						recipeId: t.String(),
						isCooked: t.Boolean(),
					}),
				})
				.delete('/', ({ query }) => removeFromSelected(query), {
					query: t.Object({ userId: t.String(), recipeId: t.String() }),
				})
		)

type RecipeRouterType = Elysia<
	'/recipes',
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
