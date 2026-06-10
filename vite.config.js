import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/room': 'http://localhost:5000',
      '/user': 'http://localhost:5000',
      '/image': 'http://localhost:5000'
    }
  }
})
