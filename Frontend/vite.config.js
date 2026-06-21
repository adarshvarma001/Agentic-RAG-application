import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      // Proxy ALL backend routes through Vite — avoids CORS entirely
      '/new-chat':     { target: 'http://localhost:8000', changeOrigin: true },
      '/chat':         { target: 'http://localhost:8000', changeOrigin: true },
      '/all-chats':    { target: 'http://localhost:8000', changeOrigin: true },
      '/chat-history': { target: 'http://localhost:8000', changeOrigin: true },
      '/history':      { target: 'http://localhost:8000', changeOrigin: true },
      '/memory':       { target: 'http://localhost:8000', changeOrigin: true },
      '/analytics':    { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
})
