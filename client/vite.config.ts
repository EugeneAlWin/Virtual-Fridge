import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
	plugins: [react(), mkcert()],
	server: {
		port: 3001,
		https: true,
	},
})
