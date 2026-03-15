import { afterAll, describe, expect, it } from "vitest"

import { getGraphqlAuthHeaders } from "@/graphql/auth"
import type { TypedDocumentString } from "@/graphql/graphql"
import { subscribe } from "@/graphql/subscribe"

const seededUserId = "22222222-2222-2222-2222-222222222221"
const seededCompanyId = "11111111-1111-1111-1111-111111111111"

type GraphQlResponse<T> = {
  data?: T
  errors?: Array<{ message?: string }>
}

const createdReceiptIds: string[] = []

async function postGraphQl<TData>(
  query: string,
  variables?: Record<string, unknown>
): Promise<TData> {
  const graphqlUrl = process.env.GRAPHQL_URL

  if (!graphqlUrl) {
    throw new Error("GRAPHQL_URL is missing for integration tests.")
  }

  const headers: Record<string, string> = {
    Accept: "application/graphql-response+json",
    "Content-Type": "application/json",
  }

  Object.assign(headers, getGraphqlAuthHeaders())

  const response = await fetch(graphqlUrl, {
    method: "POST",
    headers,
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
})

describe("GraphQL subscriptions", () => {
  it("receives receipt status updates through receiptsById", async () => {
    const insertedReceipt = await postGraphQl<{
      insertReceipts: {
        returning: Array<{
          id: string
          status: string | null
        }>
      }
    }>(
      `
          mutation InsertSubscriptionReceipt($objects: [InsertReceiptsObjectInput!]!) {
            insertReceipts(objects: $objects) {
              returning {
                id
                status
              }
            }
          }
        `,
      {
        objects: [
          {
            companyId: seededCompanyId,
            receiptDate: "2026-03-15",
            status: "processing",
            totalAmount: "0.00",
            userId: seededUserId,
            vendorName: "Subscription Test Receipt",
          },
        ],
      }
    )

    const receiptId = insertedReceipt.insertReceipts.returning[0]?.id

    expect(receiptId).toBeDefined()
    createdReceiptIds.push(receiptId!)

    const ReceiptSubscriptionDocument = `
        subscription ReceiptSubscription($id: Uuid!) {
          receiptsById(id: $id) {
            id
            status
            vendorName
            totalAmount
          }
        }
      ` as unknown as TypedDocumentString<
      {
        receiptsById?: {
          id: string
          status?: string | null
          totalAmount: string
          vendorName: string
        } | null
      },
      { id: string }
    >

    const finalStatus = await new Promise<string>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        unsubscribe()
        reject(new Error("Timed out waiting for receipt subscription update."))
      }, 10_000)

      let hasRequestedUpdate = false

      const unsubscribe = subscribe(
        ReceiptSubscriptionDocument,
        { id: receiptId! },
        {
          next: (payload) => {
            const receipt = payload.data?.receiptsById

            if (!receipt) {
              return
            }

            if (receipt.status === "processing" && !hasRequestedUpdate) {
              hasRequestedUpdate = true

              void postGraphQl(
                `
                    mutation UpdateSubscriptionReceipt(
                      $keyId: Uuid!
                      $updateColumns: UpdateReceiptsByIdUpdateColumnsInput!
                    ) {
                      updateReceiptsById(
                        keyId: $keyId
                        updateColumns: $updateColumns
                      ) {
                        affectedRows
                      }
                    }
                  `,
                {
                  keyId: receiptId,
                  updateColumns: {
                    status: {
                      set: "extracted",
                    },
                    totalAmount: {
                      set: "14.50",
                    },
                    vendorName: {
                      set: "Subscription Test Receipt Updated",
                    },
                  },
                }
              ).catch(reject)

              return
            }

            if (receipt.status === "extracted") {
              clearTimeout(timeoutId)
              unsubscribe()
              resolve(receipt.status)
            }
          },
          error: (error) => {
            clearTimeout(timeoutId)
            unsubscribe()
            reject(error)
          },
          complete: () => {
            clearTimeout(timeoutId)
          },
        }
      )
    })

    expect(finalStatus).toBe("extracted")
  }, 15_000)
})
