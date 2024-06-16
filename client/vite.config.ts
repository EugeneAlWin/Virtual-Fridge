// noinspection JSUnusedGlobalSymbols

import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: { emptyOutDir: false, outDir: '../dist/client' },
	preview: { port: 3001 },
	server: { port: 3001 },
	resolve: {
		alias: [
			{
				find: '@client',
				replacement: path.resolve(__dirname, 'src'),
			},
			{
				find: '@static',
				replacement: path.resolve(
					path.join(__dirname, '..', '/server/static')
				),
			},
			{
				find: '~shared',
				replacement: path.resolve(path.join(__dirname, '..', '/shared/')),
			},
		],
	},
})
