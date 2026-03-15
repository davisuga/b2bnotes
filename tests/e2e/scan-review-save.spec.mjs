import { expect, test } from "@playwright/test"

const receiptId = "2d943449-9cdb-4cf9-95d3-0fd225b65ec3"
const reviewPath = `/scan/revisar/${receiptId}`

test("confirmar e salvar sai da tela de revisao", async ({ page }) => {
  await page.goto(reviewPath)

  const saveButton = page.getByRole("button", {
    name: "Confirmar e salvar",
  })

  await expect(saveButton).toBeEnabled()

  await saveButton.click()

  await expect
    .poll(() => new URL(page.url()).pathname, {
      message: `Expected the app to leave ${reviewPath} after clicking Confirmar e salvar.`,
      timeout: 10_000,
    })
    .not.toBe(reviewPath)
})
