import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
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
		],
	},
})
