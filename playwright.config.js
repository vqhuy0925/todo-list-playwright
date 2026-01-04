import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: process.env.CI
    ? [
        ['list'],
        ['html', { open: 'never' }],
        ['json', { outputFile: 'playwright-report/report.json' }],
        ['junit', { outputFile: 'test-results/results.xml' }],
      ]
    : [
        ['list'],
        ['html', { open: 'never' }],
      ],
  use: {
    // APP_URL can be set via environment variable (e.g., in Jenkins)
    baseURL: process.env.APP_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
