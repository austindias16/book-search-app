import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test-utils/setup/vitest.setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      testTimeout: 15_000,
      css: false,
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/test-utils/**', 'src/**/index.ts', 'src/main.tsx'],
      },
    },
  }),
)
