import { afterAll, describe, expect, it } from "vitest"

import { getStoredImageReference } from "@/lib/r2"

const seededUserId = "22222222-2222-2222-2222-222222222221"
const seededCompanyId = "11111111-1111-1111-1111-111111111111"

type GraphQlResponse<T> = {
  data?: T
  errors?: Array<{ message?: string }>
}

const createdCompanyIds: Array<string> = []
const createdReceiptItemIds: Array<string> = []
const createdReceiptIds: Array<string> = []

async function postGraphQl<TData>(
  query: string,
  variables?: Record<string, unknown>
): Promise<TData> {
  const graphqlUrl = process.env.GRAPHQL_URL

  if (!graphqlUrl) {
    throw new Error("GRAPHQL_URL is missing for integration tests.")
  }

  const response = await fetch(graphqlUrl, {
    method: "POST",
    headers: {
      ...(process.env.GRAPHQL_AUTH_TOKEN
        ? { Authorization: `Bearer ${process.env.GRAPHQL_AUTH_TOKEN}` }
        : {}),
      Accept: "application/graphql-response+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  if (!response.ok) {
    throw new Error(`GraphQL request failed with status ${response.status}.`)
  }

  const payload = (await response.json()) as GraphQlResponse<TData>

  if (payload.errors?.length) {
    throw new Error(
      payload.errors
        .map((error) => error.message)
        .filter(Boolean)
        .join("\n") || "GraphQL returned an unknown error."
    )
  }

  if (!payload.data) {
    throw new Error("GraphQL did not return data.")
  }

  return payload.data
}

afterAll(async () => {
  while (createdReceiptItemIds.length) {
    await postGraphQl(
      `
        mutation DeleteReceiptItem($id: Uuid!) {
          deleteReceiptItemsById(keyId: $id) {
            affectedRows
          }
        }
      `,
      { id: createdReceiptItemIds.pop() }
    )
  }

  while (createdReceiptIds.length) {
    await postGraphQl(
      `
        mutation DeleteReceipt($id: Uuid!) {
          deleteReceiptsById(keyId: $id) {
            affectedRows
          }
        }
      `,
      { id: createdReceiptIds.pop() }
    )
  }

  while (createdCompanyIds.length) {
    await postGraphQl(
      `
        mutation DeleteCompany($id: Uuid!) {
          deleteCompaniesById(keyId: $id) {
            affectedRows
          }
        }
      `,
      { id: createdCompanyIds.pop() }
    )
  }
})

describe("dashboard GraphQL integration", () => {
  it("exposes spend policies, receipt extraction fields, and dashboard views", async () => {
    const companyName = `Dashboard Views Test ${Date.now()}`
    const vendorName = `Dashboard Vendor ${Date.now()}`
    const imageReference = getStoredImageReference(
      `receipts/${seededUserId}/dashboard-views-test.jpg`
    )

    const insertedCompany = await postGraphQl<{
      insertCompanies: {
        returning: Array<{
          id: string
          name: string
        }>
      }
    }>(
      `
        mutation InsertDashboardCompany($objects: [InsertCompaniesObjectInput!]!) {
          insertCompanies(objects: $objects) {
            returning {
              id
              name
            }
          }
        }
      `,
      {
        objects: [{ name: companyName }],
      }
    )

    const company = insertedCompany.insertCompanies.returning[0]
    expect(company).toBeDefined()
    createdCompanyIds.push(company.id)

    const insertedPolicy = await postGraphQl<{
      insertSpendPolicies: {
        returning: Array<{
          category: string
          companyId: string
          id: string
          maxPerMonth: string | null
          maxPerTransaction: string | null
        }>
      }
    }>(
      `
        mutation InsertDashboardPolicy($objects: [InsertSpendPoliciesObjectInput!]!) {
          insertSpendPolicies(objects: $objects) {
            returning {
              id
              category
              companyId
              maxPerMonth
              maxPerTransaction
            }
          }
        }
      `,
      {
        objects: [
          {
            category: "food",
            companyId: company.id,
            maxPerMonth: "250.00",
            maxPerTransaction: "88.00",
          },
        ],
      }
    )

    const policy = insertedPolicy.insertSpendPolicies.returning[0]
    expect(policy).toMatchObject({
      category: "food",
      companyId: company?.id,
      maxPerMonth: "250.00",
      maxPerTransaction: "88.00",
    })

    const updatedPolicy = await postGraphQl<{
      updateSpendPoliciesById: {
        returning: Array<{
          id: string
          maxPerTransaction: string | null
        }>
      }
    }>(
      `
        mutation UpdateDashboardPolicy($keyId: Uuid!, $updateColumns: UpdateSpendPoliciesByIdUpdateColumnsInput!) {
          updateSpendPoliciesById(keyId: $keyId, updateColumns: $updateColumns) {
            returning {
              id
              maxPerTransaction
            }
          }
        }
      `,
      {
        keyId: policy?.id,
        updateColumns: {
          maxPerTransaction: {
            set: "95.00",
          },
        },
      }
    )

    expect(updatedPolicy.updateSpendPoliciesById.returning[0]).toMatchObject({
      id: policy?.id,
      maxPerTransaction: "95.00",
    })

    const insertedReceipt = await postGraphQl<{
      insertReceipts: {
        returning: Array<{
          flaggedReason: string | null
          id: string
          imageUrl: string | null
          rawText: string | null
          receiptDate: string
          totalAmount: string
          vendorName: string
          vendorTaxId: string | null
          vendorTaxIdValid: boolean
        }>
      }
    }>(
      `
        mutation InsertDashboardReceipt($objects: [InsertReceiptsObjectInput!]!) {
          insertReceipts(objects: $objects) {
            returning {
              id
              flaggedReason
              imageUrl
              rawText
              receiptDate
              totalAmount
              vendorName
              vendorTaxId
              vendorTaxIdValid
            }
          }
        }
      `,
      {
        objects: [
          {
            companyId: seededCompanyId,
            flaggedReason: "no_cnpj",
            imageUrl: imageReference,
            rawText: "ARROZ TIPO 1 5KG",
            receiptDate: "2026-03-14",
            status: "extracted",
            totalAmount: "42.50",
            userId: seededUserId,
            vendorName,
            vendorTaxId: null,
            vendorTaxIdValid: false,
          },
        ],
      }
    )

    const receipt = insertedReceipt.insertReceipts.returning[0]
    expect(receipt).toMatchObject({
      flaggedReason: "no_cnpj",
      imageUrl: imageReference,
      rawText: "ARROZ TIPO 1 5KG",
      receiptDate: "2026-03-14",
      totalAmount: "42.50",
      vendorName,
      vendorTaxId: null,
      vendorTaxIdValid: false,
    })
    createdReceiptIds.push(receipt.id)

    const insertedItem = await postGraphQl<{
      insertReceiptItems: {
        returning: Array<{
          id: string
          normalizedDescription: string
          rawDescription: string
          totalPrice: string
        }>
      }
    }>(
      `
        mutation InsertDashboardReceiptItems($objects: [InsertReceiptItemsObjectInput!]!) {
          insertReceiptItems(objects: $objects) {
            returning {
              id
              normalizedDescription
              rawDescription
              totalPrice
            }
          }
        }
      `,
      {
        objects: [
          {
            category: "Alimentação",
            normalizedDescription: "Arroz 5kg",
            quantity: "1.00",
            rawDescription: "ARROZ TIPO 1 5KG",
            receiptId: receipt.id,
            totalPrice: "42.50",
            unitPrice: "42.50",
          },
        ],
      }
    )

    createdReceiptItemIds.push(insertedItem.insertReceiptItems.returning[0].id)
    expect(insertedItem.insertReceiptItems.returning[0]).toMatchObject({
      normalizedDescription: "Arroz 5kg",
      rawDescription: "ARROZ TIPO 1 5KG",
      totalPrice: "42.50",
    })

    const personalReceipt = await postGraphQl<{
      insertReceipts: {
        returning: Array<{
          id: string
        }>
      }
    }>(
      `
        mutation InsertPersonalDashboardReceipt($objects: [InsertReceiptsObjectInput!]!) {
          insertReceipts(objects: $objects) {
            returning {
              id
            }
          }
        }
      `,
      {
        objects: [
          {
            companyId: seededCompanyId,
            flaggedReason: "personal_purchase",
            rawText: "ITEM DE USO PESSOAL",
            receiptDate: "2026-03-13",
            status: "flagged",
            totalAmount: "18.90",
            userId: seededUserId,
            vendorName: `${vendorName} Personal`,
            vendorTaxId: "11444777000161",
            vendorTaxIdValid: true,
          },
        ],
      }
    )

    const personalReceiptId = personalReceipt.insertReceipts.returning[0]?.id

    if (!personalReceiptId) {
      throw new Error("The personal-expense receipt was not created.")
    }

    createdReceiptIds.push(personalReceiptId)

    const personalReceiptItem = await postGraphQl<{
      insertReceiptItems: {
        returning: Array<{
          id: string
          receiptId: string
        }>
      }
    }>(
      `
        mutation InsertPersonalDashboardReceiptItem($objects: [InsertReceiptItemsObjectInput!]!) {
          insertReceiptItems(objects: $objects) {
            returning {
              id
              receiptId
            }
          }
        }
      `,
      {
        objects: [
          {
            category: "Outros",
            normalizedDescription: "Item revisado",
            quantity: "1.00",
            rawDescription: "ITEM DE USO PESSOAL",
            receiptId: personalReceiptId,
            totalPrice: "18.90",
            unitPrice: "18.90",
          },
        ],
      }
    )

    createdReceiptItemIds.push(
      personalReceiptItem.insertReceiptItems.returning[0].id
    )
    expect(personalReceiptItem.insertReceiptItems.returning[0]?.receiptId).toBe(
      personalReceiptId
    )

    const duplicateReceipt = await postGraphQl<{
      insertReceipts: {
        returning: Array<{
          id: string
        }>
      }
    }>(
      `
        mutation InsertDuplicateDashboardReceipt($objects: [InsertReceiptsObjectInput!]!) {
          insertReceipts(objects: $objects) {
            returning {
              id
            }
          }
        }
      `,
      {
        objects: [
          {
            companyId: seededCompanyId,
            receiptDate: "2026-03-14",
            status: "approved",
            totalAmount: "42.50",
            userId: seededUserId,
            vendorName,
            vendorTaxId: "11444777000161",
            vendorTaxIdValid: true,
          },
        ],
      }
    )

    const duplicateReceiptId = duplicateReceipt.insertReceipts.returning[0]?.id

    if (!duplicateReceiptId) {
      throw new Error("The duplicate receipt was not created.")
    }

    createdReceiptIds.push(duplicateReceiptId)

    const duplicateItem = await postGraphQl<{
      insertReceiptItems: {
        returning: Array<{
          id: string
          receiptId: string
        }>
      }
    }>(
      `
        mutation InsertDuplicateDashboardReceiptItem($objects: [InsertReceiptItemsObjectInput!]!) {
          insertReceiptItems(objects: $objects) {
            returning {
              id
              receiptId
            }
          }
        }
      `,
      {
        objects: [
          {
            category: "Alimentação",
            normalizedDescription: "Arroz 5kg",
            quantity: "1.00",
            rawDescription: "ARROZ TIPO 1 5KG",
            receiptId: duplicateReceiptId,
            totalPrice: "42.50",
            unitPrice: "42.50",
          },
        ],
      }
    )

    createdReceiptItemIds.push(duplicateItem.insertReceiptItems.returning[0].id)
    expect(duplicateItem.insertReceiptItems.returning[0]?.receiptId).toBe(
      duplicateReceiptId
    )

    const dashboardViews = await postGraphQl<{
      dashboardAlerts: Array<{
        alertId: string
        alertType: string
      }> | null
      dashboardCategorySpend: Array<{
        category: string
        totalSpent: string
      }> | null
      dashboardEmployeeSpend: Array<{
        receiptCount: string
        totalSpent: string
        topCategory: string
        userId: string
      }> | null
      dashboardProducts: Array<{
        employeeCount: string
        productName: string
        purchaseCount: string
        totalSpent: string
      }> | null
      dashboardReceiptHistory: Array<{
        itemCount: string
        primaryCategory: string
        receiptId: string
        totalAmount: string
      }> | null
      dashboardSummary: Array<{
        receiptsProcessed: string
        totalSpent: string
        uniqueEmployees: string
        uniqueProducts: string
      }> | null
    }>(
      `
        query DashboardViews($companyId: Uuid!, $periodKey: String1!) {
          dashboardSummary(
            where: { companyId: { _eq: $companyId }, periodKey: { _eq: $periodKey } }
          ) {
            receiptsProcessed
            totalSpent
            uniqueEmployees
            uniqueProducts
          }
          dashboardEmployeeSpend(
            where: { companyId: { _eq: $companyId }, periodKey: { _eq: $periodKey } }
          ) {
            userId
            receiptCount
            totalSpent
            topCategory
          }
          dashboardProducts(
            where: { companyId: { _eq: $companyId }, periodKey: { _eq: $periodKey } }
          ) {
            productName
            purchaseCount
            employeeCount
            totalSpent
          }
          dashboardCategorySpend(
            where: { companyId: { _eq: $companyId }, periodKey: { _eq: $periodKey } }
          ) {
            category
            totalSpent
          }
          dashboardReceiptHistory(
            where: { companyId: { _eq: $companyId }, periodKey: { _eq: $periodKey } }
          ) {
            receiptId
            itemCount
            primaryCategory
            totalAmount
          }
          dashboardAlerts(
            where: { companyId: { _eq: $companyId }, periodKey: { _eq: $periodKey } }
          ) {
            alertId
            alertType
          }
        }
      `,
      {
        companyId: seededCompanyId,
        periodKey: "30d",
      }
    )

    expect(dashboardViews.dashboardSummary?.[0]).toMatchObject({
      receiptsProcessed: expect.any(String),
      totalSpent: expect.any(String),
      uniqueEmployees: expect.any(String),
      uniqueProducts: expect.any(String),
    })

    expect(
      dashboardViews.dashboardEmployeeSpend?.some(
        (entry) => entry.userId === seededUserId && entry.topCategory === "food"
      )
    ).toBe(true)

    expect(
      dashboardViews.dashboardProducts?.some(
        (entry) =>
          entry.productName === "Arroz 5kg" &&
          Number.parseInt(entry.purchaseCount, 10) >= 1 &&
          Number.parseInt(entry.employeeCount, 10) >= 1 &&
          Number.parseFloat(entry.totalSpent) >= 42.5
      )
    ).toBe(true)

    expect(
      dashboardViews.dashboardCategorySpend?.some(
        (entry) =>
          entry.category === "food" &&
          Number.parseFloat(entry.totalSpent) >= 42.5
      )
    ).toBe(true)

    expect(
      dashboardViews.dashboardReceiptHistory?.some(
        (entry) =>
          entry.receiptId === receipt?.id &&
          entry.itemCount === "1" &&
          entry.primaryCategory === "food" &&
          entry.totalAmount === "42.50"
      )
    ).toBe(true)

    expect(
      dashboardViews.dashboardAlerts?.some(
        (entry) => entry.alertType === "tax_invalid"
      )
    ).toBe(true)

    expect(
      dashboardViews.dashboardAlerts?.some(
        (entry) => entry.alertType === "personal_purchase"
      )
    ).toBe(true)

    expect(
      dashboardViews.dashboardAlerts?.some(
        (entry) => entry.alertType === "duplicate_receipts"
      )
    ).toBe(true)
  }, 20_000)
})
