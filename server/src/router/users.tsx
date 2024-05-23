import { Roles } from '@prisma/client'
import {
	create,
	getAll,
	getOne,
	signin,
	signout,
	update,
} from '@server/services/user'
import { Elysia, t } from 'elysia'

export const users = (app: Elysia<'/users'>) =>
	app
		.get('/one', ({ query }) => getOne(query.login), {
			query: t.Object({
				login: t.String(),
			}),
		})
		.get('/', ({ query }) => getAll(query), {
			query: t.Object({
				take: t.Optional(t.Number({ minimum: 1 })),
				cursor: t.Optional(t.Nullable(t.String())),
				login: t.Optional(t.String()),
			}),
		})
		.post('/create', ({ body }) => create(body), {
			body: t.Object({
				login: t.String(),
				password: t.String(),
				role: t.Enum(Roles, { default: Roles.DEFAULT }),
				isBlocked: t.Optional(t.Boolean({ default: false })),
				isFrozen: t.Optional(t.Boolean({ default: false })),
				deviceId: t.String(),
			}),
		})
		.patch('/update', ({ body }) => update(body), {
			body: t.Object({
				id: t.String(),
				login: t.Optional(t.String()),
				password: t.Optional(t.String()),
				role: t.Optional(t.Enum(Roles, { default: Roles.DEFAULT })),
				isBlocked: t.Optional(t.Boolean({ default: false })),
				isFrozen: t.Optional(t.Boolean({ default: false })),
			}),
		})
		.post(
			'/signin',
			async ({ body, cookie: { refreshToken } }) => {
				const tokens = await signin(body)
				refreshToken.set({
					value: tokens.refreshToken,
					httpOnly: true,
				})
			},
			{
				body: t.Object({
					password: t.String(),
					login: t.String(),
					deviceId: t.String(),
				}),
			}
		)
		.delete('/signout', ({ body }) => signout(body), {
			body: t.Object({
				userId: t.String(),
				deviceId: t.String(),
			}),
		})
