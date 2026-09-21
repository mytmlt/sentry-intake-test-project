import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { intakeLabPlugin } from './tools/vite-plugin.ts'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), intakeLabPlugin(env)],
    build: {
      sourcemap: true,
    },
  }
})
