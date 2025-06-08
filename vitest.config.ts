/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      name: 'chromium',
      headless: true,
    },
    include: ['src/**/*.{test,spec}.{js,ts}'],
    globals: true,
  },
});
