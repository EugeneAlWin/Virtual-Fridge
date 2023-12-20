import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [react()],
	server: {
		port: 3001,
		https: false,
	},
	build: {
		minify: 'esbuild',
		cssMinify: true,
	},
	esbuild: {
		// drop: ['console', 'debugger'],
		legalComments: 'none',
		minifyIdentifiers: true,
		minifyWhitespace: true,
		minifySyntax: true,
	},
})
