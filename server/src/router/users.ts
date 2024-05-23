import cookie from '@elysiajs/cookie'
import cors from '@elysiajs/cors'
import { Roles } from '@prisma/client'
import {
	create,
	getAll,
	getOne,
	signin,
	signout,
	signup,
	update,
} from '@server/services/user'
import { Elysia, t } from 'elysia'

export const users = (app: UserRouterType) =>
	app
		.onError(e => console.log(e))
		.use(cors({ credentials: true, origin: 'localhost:5173' }))
		.use(cookie())
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
				const { user, ...tokens } = await signin(body)
				refreshToken.set({
					value: tokens.accessToken,
					httpOnly: true,
				})
				return { user, refreshToken: tokens.refreshToken }
			},
			{
				body: t.Object({
					password: t.String(),
					login: t.String(),
					deviceId: t.String(),
				}),
			}
		)
		.post(
			'/signup',
			async ({ body, cookie: { refreshToken } }) => {
				const { user, ...tokens } = await signup(body)
				refreshToken.set({
					value: tokens.accessToken,
					httpOnly: true,
				})
				return { user, refreshToken: tokens.refreshToken }
			},
			{
				body: t.Object({
					password: t.String(),
					login: t.String(),
					deviceId: t.String(),
					role: t.Optional(t.Enum(Roles, { default: Roles.DEFAULT })),
					isBlocked: t.Optional(t.Boolean({ default: false })),
					isFrozen: t.Optional(t.Boolean({ default: false })),
				}),
			}
		)
		.delete(
			'/signout',
			async ({ body, cookie: { refreshToken } }) => {
				await signout(body)
				refreshToken.remove()
			},
			{
				body: t.Object({
					userId: t.String(),
					deviceId: t.String(),
				}),
			}
		)

type UserRouterType = Elysia<
	'/users',
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
