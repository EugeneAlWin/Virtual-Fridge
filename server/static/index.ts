import { cors } from '@elysiajs/cors'
import { EntityType } from '@static/types'
import { Elysia, InternalServerError, t } from 'elysia'

const app = new Elysia()
	.use(cors({ credentials: true }))
	.post(
		'/',
		async ({ body, query, set }) => {
			const image = body.image
			if (!(image instanceof File)) {
				set.status = 422
				throw new Error('Not a file type')
			}

			if (!image.name) {
				set.status = 400
				throw new Error('No image found in FormData', {
					cause: 'formData image is undefined',
				})
			}

			const fileExtension = image.name.split('.').pop()
			if (fileExtension !== 'jpg') {
				set.status = 422
				throw new Error('Not a jpg format')
			}

			const result = await Bun.write(
				`${__dirname}/data/${query.type}_${query.entityId}.jpg`,
				image,
				{ createPath: true }
			)
			if (!result) return new InternalServerError('Can not write file')
			return new Response()
		},
		{
			query: t.Object({
				type: t.Enum(EntityType),
				entityId: t.String(),
			}),
			body: t.Object({
				image: t.File(),
			}),
		}
	)
	.get(
		':type/:entityId',
		async ({ params }) =>
			Bun.file(`${__dirname}/data/${params.type}_${params.entityId}.jpg`),
		{
			params: t.Object({
				type: t.Enum(EntityType),
				entityId: t.String(),
			}),
		}
	)
	.listen(3005, () => console.log('Static server listening 3005 port'))

export type STATIC_SERVER_TYPE = typeof app
