import { describe, expect, it } from "vitest"

import type { DashboardBootstrap } from "@/features/dashboard/model"
import { buildDashboardView } from "@/features/dashboard/model"

const companyId = "company-1"

const dashboardFixture: DashboardBootstrap = {
  companyId,
  policyLimits: [
    {
      id: "policy-food",
      category: "food",
      companyId,
      maxPerMonth: null,
      maxPerTransaction: 50,
    },
    {
      id: "policy-fuel",
      category: "fuel",
      companyId,
      maxPerMonth: null,
      maxPerTransaction: 150,
    },
    {
      id: "policy-office",
      category: "office-supplies",
      companyId,
      maxPerMonth: null,
      maxPerTransaction: 120,
    },
    {
      id: "policy-cleaning",
      category: "cleaning",
      companyId,
      maxPerMonth: null,
      maxPerTransaction: 90,
    },
    {
      id: "policy-other",
      category: "other",
      companyId,
      maxPerMonth: null,
      maxPerTransaction: 75,
    },
  ],
  users: [
    { id: "alice", companyId, fullName: "Alice Johnson" },
    { id: "bob", companyId, fullName: "Bob Smith" },
    { id: "charlie", companyId, fullName: "Charlie Stone" },
  ],
  receipts: [
    {
      createdAt: "2026-03-10T10:00:00Z",
      id: "current-1",
      imageRef: null,
      items: [
        {
          id: "item-1",
          category: "Fuel",
          description: "Fuel",
          quantity: 1,
          totalPrice: 300,
          unitPrice: 300,
        },
      ],
      receiptDate: "2026-03-10",
      status: "extracted",
      totalAmount: 300,
      userId: "alice",
      userName: "Alice Johnson",
      vendorName: "FuelUp",
      vendorTaxId: "11444777000161",
      vendorTaxIdValid: true,
    },
    {
      createdAt: "2026-03-12T10:00:00Z",
      id: "current-2",
      imageRef: null,
      items: [
        {
          id: "item-2",
          category: "Pantry",
          description: "Coffee Beans",
          quantity: 1,
          totalPrice: 200,
          unitPrice: 200,
        },
      ],
      receiptDate: "2026-03-12",
      status: "extracted",
      totalAmount: 200,
      userId: "alice",
      userName: "Alice Johnson",
      vendorName: "Cafe Central",
      vendorTaxId: "11444777000161",
      vendorTaxIdValid: true,
    },
    {
      createdAt: "2026-03-13T10:00:00Z",
      id: "current-3",
      imageRef: null,
      items: [
        {
          id: "item-3",
          category: "Personal Care",
          description: "Shampoo",
          quantity: 1,
          totalPrice: 50,
          unitPrice: 50,
        },
      ],
      receiptDate: "2026-03-13",
      status: "extracted",
      totalAmount: 50,
      userId: "bob",
      userName: "Bob Smith",
      vendorName: "Market",
      vendorTaxId: "",
      vendorTaxIdValid: false,
    },
    {
      createdAt: "2026-03-11T10:00:00Z",
      id: "current-4",
      imageRef: null,
      items: [
        {
          id: "item-4",
          category: "Office Supplies",
          description: "Printer Paper",
          quantity: 1,
          totalPrice: 30,
          unitPrice: 30,
        },
      ],
      receiptDate: "2026-03-11",
      status: "extracted",
      totalAmount: 30,
      userId: "bob",
      userName: "Bob Smith",
      vendorName: "Office Max",
      vendorTaxId: "11444777000161",
      vendorTaxIdValid: true,
    },
    {
      createdAt: "2026-03-11T11:00:00Z",
      id: "current-5",
      imageRef: null,
      items: [
        {
          id: "item-5",
          category: "Office Supplies",
          description: "Printer Paper",
          quantity: 1,
          totalPrice: 30,
          unitPrice: 30,
        },
      ],
      receiptDate: "2026-03-11",
      status: "extracted",
      totalAmount: 30,
      userId: "bob",
      userName: "Bob Smith",
      vendorName: "Office Max",
      vendorTaxId: "11444777000161",
      vendorTaxIdValid: true,
    },
    {
      createdAt: "2026-03-11T12:00:00Z",
      id: "current-6",
      flaggedReason: "personal_purchase",
      imageRef: null,
      items: [
        {
          id: "item-6",
          category: "Office Supplies",
          description: "Printer Paper",
          quantity: 1,
          totalPrice: 32,
          unitPrice: 32,
        },
      ],
      receiptDate: "2026-03-11",
      status: "extracted",
      totalAmount: 32,
      userId: "charlie",
      userName: "Charlie Stone",
      vendorName: "Office Max West",
      vendorTaxId: "11444777000161",
      vendorTaxIdValid: true,
    },
    {
      createdAt: "2026-03-11T13:00:00Z",
      id: "current-7",
      imageRef: null,
      items: [
        {
          id: "item-7",
          category: "Office Supplies",
          description: "Printer Paper",
          quantity: 1,
          totalPrice: 45,
          unitPrice: 45,
        },
      ],
      receiptDate: "2026-03-11",
      status: "extracted",
      totalAmount: 45,
      userId: "charlie",
      userName: "Charlie Stone",
      vendorName: "Office Max South",
      vendorTaxId: "11444777000161",
      vendorTaxIdValid: true,
    },
  ],
}

describe("buildDashboardView", () => {
  it("builds strict dashboard insights from receipt data", () => {
    const view = buildDashboardView(
      dashboardFixture,
      "30d",
      new Date("2026-03-14T12:00:00Z")
    )

    expect(view.summary).toEqual({
      receiptsProcessed: 7,
      totalSpent: 687,
      uniqueEmployees: 3,
      uniqueProducts: 4,
    })

    expect(view.employees.map((employee) => employee.userName)).toEqual([
      "Alice Johnson",
      "Bob Smith",
      "Charlie Stone",
    ])

    expect(view.policyRows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: "food",
          breachCount: 1,
          totalSpent: 200,
        }),
        expect.objectContaining({
          category: "fuel",
          breachCount: 1,
          totalSpent: 300,
        }),
      ])
    )

    expect(
      view.products.find((product) => product.name === "Printer Paper")
    ).toMatchObject({
      purchaseCount: 4,
      employeeCount: 2,
      totalSpent: 137,
    })

    expect(view.alerts.map((alert) => alert.id)).toEqual(
      expect.arrayContaining([
        "policy:current-1:fuel",
        "policy:current-2:food",
        "tax:current-3",
        "personal:current-6",
        "duplicate:office max:2026-03-11:30.00",
        "bulk:printer paper",
        "price:printer paper",
      ])
    )

    expect(
      view.alerts.find((alert) => alert.id === "personal:current-6")
    ).toMatchObject({
      metric: expect.stringContaining("32"),
      text: expect.stringContaining(
        "A IA classificou o recibo enviado por Charlie Stone em Office Max West"
      ),
    })
  })
})
