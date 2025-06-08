/// <reference types="vitest" />
/// <reference types="@vitest/browser/providers/playwright" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      instances: [
        {
          browser: 'chromium',
        },
      ],
    },
  },
})
