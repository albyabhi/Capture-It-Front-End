import { defineConfig } from 'vite'
import eslintPlugin from 'vite-plugin-eslint';
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), eslintPlugin()],
})
