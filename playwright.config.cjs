const { defineConfig } = require("@playwright/test")

module.exports = defineConfig({
  testDir: "./tests/e2e",
  timeout: 15_000,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
})
