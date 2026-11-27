import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "tests/e2e",
  reporter: "list",
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      // Chromium with a phone-sized, touch-enabled viewport (mobile first).
      use: {
        ...devices["Desktop Chrome"],
        // PW_CHANNEL=chrome uses the locally installed Google Chrome, for
        // systems where Playwright has no Chromium build, e.g. macOS 13 (#22).
        channel: process.env.PW_CHANNEL,
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: baseURL,
    timeout: 120_000,
    reuseExistingServer: false,
  },
});
