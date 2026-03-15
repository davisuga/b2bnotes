import { afterAll, describe, expect, it } from "vitest"

import { getGraphqlAuthHeaders } from "@/graphql/auth"
import {
  createPresignedReceiptUploadUrl,
  downloadReceiptObject,
  getStoredImageReference,
} from "@/lib/r2"

const seededUserId = "22222222-2222-2222-2222-222222222221"
const seededCompanyId = "11111111-1111-1111-1111-111111111111"
const tinyJpegBase64 =
  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEBAQEA8QDw8PEA8PDw8PDw8QDw8PFRUWFhUVFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGhAQGi0fHR0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAAEAAQMBIgACEQEDEQH/xAAXAAEBAQEAAAAAAAAAAAAAAAAAAQID/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEAMQAAAB6A//xAAXEAEBAQEAAAAAAAAAAAAAAAABEQAh/9oACAEBAAEFAt0j/8QAFBEBAAAAAAAAAAAAAAAAAAAAEP/aAAgBAwEBPwEf/8QAFBEBAAAAAAAAAAAAAAAAAAAAEP/aAAgBAgEBPwEf/8QAFxABAQEBAAAAAAAAAAAAAAAAAQARIf/aAAgBAQAGPwKzL//EABgQAQEBAQEAAAAAAAAAAAAAAAERACEx/9oACAEBAAE/IQW0jYo3a//aAAwDAQACAAMAAAAQ8//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8QH//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8QH//EABkQAQADAQEAAAAAAAAAAAAAAAEAESExQf/aAAgBAQABPxA41EMmQrEoV0B8a//Z"

type GraphQlResponse<T> = {
  data?: T
  errors?: Array<{ message?: string }>
}

type CreatedRecordIds = {
  receiptId?: string
  receiptItemId?: string
}

const createdRecordIds: CreatedRecordIds = {}

async function postGraphQl<TData>(
  query: string,
  variables?: Record<string, unknown>,
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
        .join("\n") || "GraphQL returned an unknown error.",
    )
  }

  if (!payload.data) {
    throw new Error("GraphQL did not return data.")
  }

  return payload.data
}

async function cleanupCreatedRecords() {
  if (createdRecordIds.receiptItemId) {
    await postGraphQl(
      `
        mutation DeleteReceiptItem($id: Uuid!) {
          deleteReceiptItemsById(keyId: $id) {
            affectedRows
          }
        }
      `,
      { id: createdRecordIds.receiptItemId },
    )
  }

  if (createdRecordIds.receiptId) {
    await postGraphQl(
      `
        mutation DeleteReceipt($id: Uuid!) {
          deleteReceiptsById(keyId: $id) {
            affectedRows
          }
        }
      `,
      { id: createdRecordIds.receiptId },
    )
  }
}

afterAll(async () => {
  await cleanupCreatedRecords()
})

describe("scan upload integration", () => {
  it(
    "uploads a receipt object to R2 and persists the uploaded reference through GraphQL",
    async () => {
      const upload = await createPresignedReceiptUploadUrl({
        contentType: "image/jpeg",
        fileName: "integration-test-receipt.jpg",
        userId: seededUserId,
      })

      const imageBytes = Buffer.from(tinyJpegBase64, "base64")
      const uploadResponse = await fetch(upload.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": upload.contentType,
        },
        body: imageBytes,
      })

      expect(uploadResponse.ok).toBe(true)

      const storedObject = await downloadReceiptObject(upload.objectKey)
      expect(Buffer.compare(storedObject.buffer, imageBytes)).toBe(0)
      expect(storedObject.contentType).toBe("image/jpeg")

      const imageReference = getStoredImageReference(upload.objectKey)
      const insertedReceipt = await postGraphQl<{
        insertReceipts: {
          returning: Array<{
            id: string
            imageUrl: string | null
            status: string | null
            userId: string
            companyId: string
          }>
        }
      }>(
        `
          mutation InsertIntegrationReceipt($objects: [InsertReceiptsObjectInput!]!) {
            insertReceipts(objects: $objects) {
              returning {
                id
                imageUrl
                status
                userId
                companyId
              }
            }
          }
        `,
        {
          objects: [
            {
              companyId: seededCompanyId,
              imageUrl: imageReference,
              receiptDate: "2026-03-14",
              status: "extracted",
              totalAmount: "1.00",
              userId: seededUserId,
              vendorName: "Integration Upload Test",
            },
          ],
        },
      )

      const receipt = insertedReceipt.insertReceipts.returning[0]
      expect(receipt).toBeDefined()
      createdRecordIds.receiptId = receipt?.id

      expect(receipt?.imageUrl).toBe(imageReference)
      expect(receipt?.status).toBe("extracted")
      expect(receipt?.userId).toBe(seededUserId)
      expect(receipt?.companyId).toBe(seededCompanyId)

      const insertedItem = await postGraphQl<{
        insertReceiptItems: {
          returning: Array<{
            id: string
            receiptId: string
            totalPrice: string
          }>
        }
      }>(
        `
          mutation InsertIntegrationReceiptItem($objects: [InsertReceiptItemsObjectInput!]!) {
            insertReceiptItems(objects: $objects) {
              returning {
                id
                receiptId
                totalPrice
              }
            }
          }
        `,
        {
          objects: [
            {
              category: "Test",
              normalizedDescription: "Uploaded test item",
              quantity: "1.00",
              rawDescription: "Uploaded test item",
              receiptId: receipt?.id,
              totalPrice: "1.00",
              unitPrice: "1.00",
            },
          ],
        },
      )

      const item = insertedItem.insertReceiptItems.returning[0]
      expect(item).toBeDefined()
      createdRecordIds.receiptItemId = item?.id
      expect(item?.receiptId).toBe(receipt?.id)
      expect(item?.totalPrice).toBe("1.00")

      const queriedReceipt = await postGraphQl<{
        receiptsById: {
          id: string
          imageUrl: string | null
          receiptItems: Array<{
            id: string
            normalizedDescription: string
          }> | null
        } | null
      }>(
        `
          query IntegrationReceiptById($id: Uuid!) {
            receiptsById(id: $id) {
              id
              imageUrl
              receiptItems {
                id
                normalizedDescription
              }
            }
          }
        `,
        { id: receipt?.id },
      )

      expect(queriedReceipt.receiptsById?.imageUrl).toBe(imageReference)
      expect(
        queriedReceipt.receiptsById?.receiptItems?.some(
          (receiptItem) => receiptItem.id === item?.id,
        ),
      ).toBe(true)
    },
    20_000,
  )
})
