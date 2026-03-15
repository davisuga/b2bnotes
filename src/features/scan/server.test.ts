import { describe, expect, it } from "vitest"

import { resolveReviewedReceiptFraudState } from "@/features/scan/server"

describe("resolveReviewedReceiptFraudState", () => {
  it("prioritizes duplicate receipts over personal-expense AI flags", () => {
    expect(
      resolveReviewedReceiptFraudState({
        hasDuplicateReceipt: true,
        personalExpenseClassification: {
          confidence: 0.98,
          primaryItemId: "item-1",
          reason: "Clearly personal retail item.",
          verdict: "personal",
        },
      })
    ).toEqual({
      flaggedReason: "duplicate",
      status: "flagged",
    })
  })

  it("flags high-confidence personal-expense classifications", () => {
    expect(
      resolveReviewedReceiptFraudState({
        hasDuplicateReceipt: false,
        personalExpenseClassification: {
          confidence: 0.9,
          primaryItemId: "item-2",
          reason: "The receipt includes clearly personal consumption items.",
          verdict: "personal",
        },
      })
    ).toEqual({
      flaggedReason: "personal_purchase",
      status: "flagged",
    })
  })

  it("keeps the receipt approved for non-personal or low-confidence results", () => {
    expect(
      resolveReviewedReceiptFraudState({
        hasDuplicateReceipt: false,
        personalExpenseClassification: {
          confidence: 0.84,
          primaryItemId: "item-3",
          reason: "Evidence is suggestive but not conclusive.",
          verdict: "personal",
        },
      })
    ).toEqual({
      flaggedReason: null,
      status: "approved",
    })

    expect(
      resolveReviewedReceiptFraudState({
        hasDuplicateReceipt: false,
        personalExpenseClassification: {
          confidence: 0.96,
          primaryItemId: "",
          reason: "The reviewed items are consistent with office purchasing.",
          verdict: "business",
        },
      })
    ).toEqual({
      flaggedReason: null,
      status: "approved",
    })

    expect(
      resolveReviewedReceiptFraudState({
        hasDuplicateReceipt: false,
        personalExpenseClassification: null,
      })
    ).toEqual({
      flaggedReason: null,
      status: "approved",
    })
  })
})
