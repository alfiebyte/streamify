import { defineConfig } from "vitest/config"
import react from '@vitejs/plugin-react'
import { loadEnv } from "vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    env: loadEnv(mode, import.meta.dirname, ''),
    setupFiles: "./tests/setupTests.ts",
  }
}))
