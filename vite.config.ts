import { defineConfig } from "vitest/config"
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    setupFiles: "./tests/setupTests.ts",
    env: process.env
  }
})
