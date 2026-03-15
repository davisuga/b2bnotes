import { Output, generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import { createServerFn } from "@tanstack/react-start"

import { graphql } from "@/graphql"
import { execute } from "@/graphql/execute"
import type { TypedDocumentString } from "@/graphql/graphql"
import { subscribe } from "@/graphql/subscribe"
import {
  analyzedReceiptDraftSchema,
  analyzeReceiptInputSchema,
  createReceiptUploadInputSchema,
  graphQlUuidSchema,
  saveReceiptInputSchema,
} from "@/features/scan/types"
import {
  downloadReceiptObject,
  getStoredImageReference,
  createPresignedReceiptUploadUrl,
} from "@/lib/r2"
import {
  calculateItemTotal,
  isValidBrazilCnpj,
  normalizeOcrText,
  normalizeVendorTaxId,
  getTodayDate,
} from "@/features/scan/utils"

type OcrProvider = "gemini" | "modal"

const ScanBootstrapQuery = graphql(`
  query ScanBootstrap {
    users(order_by: [{ fullName: Asc }]) {
      id
      fullName
      companyId
    }
  }
`)

const UserContextQuery = graphql(`
  query ScanUserContext($id: Uuid!) {
    usersById(id: $id) {
      id
      fullName
      companyId
    }
  }
`)

const InsertReceiptMutation = graphql(`
  mutation InsertScanReceipt($objects: [InsertReceiptsObjectInput!]!) {
    insertReceipts(objects: $objects) {
      returning {
        id
        vendorName
        receiptDate
        totalAmount
        status
        imageUrl
        userId
        vendorTaxId
        vendorTaxIdValid
        companyId
      }
    }
  }
`)

const InsertReceiptItemsMutation = graphql(`
  mutation InsertScanReceiptItems($objects: [InsertReceiptItemsObjectInput!]!) {
    insertReceiptItems(objects: $objects) {
      affectedRows
      returning {
        id
        description
        category
        quantity
        unitPrice
        totalPrice
      }
    }
  }
`)

const UpdateReceiptMutation = graphql(`
  mutation UpdateScanReceipt(
    $keyId: Uuid!
    $updateColumns: UpdateReceiptsByIdUpdateColumnsInput!
  ) {
    updateReceiptsById(keyId: $keyId, updateColumns: $updateColumns) {
      returning {
        id
        vendorName
        receiptDate
        totalAmount
        status
        imageUrl
        userId
        vendorTaxId
        vendorTaxIdValid
        companyId
      }
    }
  }
`)

const ReceiptItemIdsQuery = graphql(`
  query ScanReceiptItemIds($id: Uuid!) {
    receiptsById(id: $id) {
      id
      receiptItems {
        id
      }
    }
  }
`)

const DeleteReceiptItemMutation = graphql(`
  mutation DeleteScanReceiptItem($id: Uuid!) {
    deleteReceiptItemsById(keyId: $id) {
      affectedRows
    }
  }
`)

const ReceiptParsingSubscription = `
  subscription ScanReceiptParsingStatus($id: Uuid!) {
    receiptsById(id: $id) {
      id
      status
      vendorName
      vendorTaxId
      receiptDate
      totalAmount
      receiptItems(order_by: [{ totalPrice: Desc }, { description: Asc }]) {
        id
        description
        category
        quantity
        unitPrice
        totalPrice
      }
    }
  }
` as unknown as TypedDocumentString<
  ReceiptParsingSubscriptionResult,
  { id: string }
>

const draftReceiptPlaceholderName = "Processando recibo"
const processingReceiptStatus = "processing"
const parsedReceiptStatus = "extracted"
const finalizedReceiptStatus = "approved"
const failedReceiptStatus = "flagged"
const modalOcrEndpoint = "https://0xthiagomartins--glm-ocr-ocr.modal.run"

function getParserModel() {
  if (process.env.GOOGLE_AI_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return process.env.GOOGLE_AI_MODEL ?? "gemini-2.5-flash"
  }

  return process.env.OPENAI_MODEL ?? "gpt-4.1-mini"
}

function getParserProvider() {
  const googleApiKey =
    process.env.GOOGLE_AI_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY

  if (googleApiKey) {
    return createGoogleGenerativeAI({ apiKey: googleApiKey })
  }

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error(
      "Defina GOOGLE_AI_KEY ou OPENAI_API_KEY antes de analisar recibos."
    )
  }

  return createOpenAI({ apiKey })
}

function getGoogleVisionProvider() {
  const googleApiKey =
    process.env.GOOGLE_AI_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY

  if (!googleApiKey) {
    throw new Error("GOOGLE_AI_KEY é obrigatória para o OCR de recibos.")
  }

  return createGoogleGenerativeAI({ apiKey: googleApiKey })
}

function getGoogleVisionModel() {
  return (
    process.env.GOOGLE_AI_VISION_MODEL ??
    process.env.GOOGLE_AI_MODEL ??
    "gemini-2.5-flash"
  )
}

async function fetchUserContext(userId: string) {
  const data = await execute(UserContextQuery, { id: userId })
  const user = data.usersById

  if (!user) {
    throw new Error("Não foi possível encontrar o funcionário selecionado.")
  }

  return user
}

function formatReceiptNumber(value: number) {
  return value.toFixed(2)
}

function getVendorTaxUpdateColumns(vendorTaxId: string | undefined) {
  const normalizedVendorTaxId = normalizeVendorTaxId(vendorTaxId ?? "")

  return {
    vendorTaxId: {
      set: normalizedVendorTaxId || null,
    },
    vendorTaxIdValid: {
      set: normalizedVendorTaxId
        ? isValidBrazilCnpj(normalizedVendorTaxId)
        : false,
    },
  }
}

async function persistReceipt(input: {
  companyId: string
  imageReference?: string
  items: Array<{
    category?: string
    name: string
    rawName?: string
    quantity: number
    unitPrice: number
  }>
  receiptDate: string
  status: string
  totalAmount: number
  userId: string
  vendorName: string
  vendorTaxId?: string
}) {
  const normalizedVendorTaxId = normalizeVendorTaxId(input.vendorTaxId ?? "")

  const receiptData = await execute(InsertReceiptMutation, {
    objects: [
      {
        companyId: input.companyId,
        imageUrl: input.imageReference,
        receiptDate: input.receiptDate,
        status: input.status,
        totalAmount: input.totalAmount.toFixed(2),
        userId: input.userId,
        vendorName: input.vendorName,
        vendorTaxId: normalizedVendorTaxId || undefined,
        vendorTaxIdValid: normalizedVendorTaxId
          ? isValidBrazilCnpj(normalizedVendorTaxId)
          : false,
      },
    ],
  })

  const savedReceipt = receiptData.insertReceipts.returning[0]

  if (!savedReceipt) {
    throw new Error("Não foi possível salvar o recibo.")
  }

  if (!input.items.length) {
    return {
      receipt: savedReceipt,
      items: [],
    }
  }

  const itemsData = await execute(InsertReceiptItemsMutation, {
    objects: input.items.map((item) => ({
      category: item.category || undefined,
      description: item.name,
      normalizedDescription: item.name,
      quantity: item.quantity.toFixed(2),
      rawDescription: item.rawName?.trim() || item.name,
      receiptId: savedReceipt.id,
      totalPrice: calculateItemTotal(item.quantity, item.unitPrice).toFixed(2),
      unitPrice: item.unitPrice.toFixed(2),
    })),
  })

  return {
    receipt: savedReceipt,
    items: itemsData.insertReceiptItems.returning,
  }
}

async function updateReceipt(input: {
  imageReference?: string
  receiptDate?: string
  receiptId: string
  status?: string
  totalAmount?: number
  userId?: string
  vendorName?: string
  vendorTaxId?: string
}) {
  const updateColumns: Record<string, { set: string | boolean | null }> = {}

  if (input.imageReference !== undefined) {
    updateColumns.imageUrl = {
      set: input.imageReference,
    }
  }

  if (input.receiptDate !== undefined) {
    updateColumns.receiptDate = {
      set: input.receiptDate,
    }
  }

  if (input.status !== undefined) {
    updateColumns.status = {
      set: input.status,
    }
  }

  if (input.totalAmount !== undefined) {
    updateColumns.totalAmount = {
      set: formatReceiptNumber(input.totalAmount),
    }
  }

  if (input.userId !== undefined) {
    updateColumns.userId = {
      set: input.userId,
    }
  }

  if (input.vendorName !== undefined) {
    updateColumns.vendorName = {
      set: input.vendorName,
    }
  }

  if (input.vendorTaxId !== undefined) {
    Object.assign(updateColumns, getVendorTaxUpdateColumns(input.vendorTaxId))
  }

  const data = await execute(UpdateReceiptMutation, {
    keyId: input.receiptId,
    updateColumns,
  })

  const updatedReceipt = data.updateReceiptsById.returning[0]

  if (!updatedReceipt) {
    throw new Error("Não foi possível atualizar o recibo.")
  }

  return updatedReceipt
}

async function clearReceiptItems(receiptId: string) {
  const data = await execute(ReceiptItemIdsQuery, { id: receiptId })
  const itemIds = (data.receiptsById?.receiptItems ?? []).map((item) => item.id)

  await Promise.all(
    itemIds.map((itemId) => execute(DeleteReceiptItemMutation, { id: itemId }))
  )
}

async function replaceReceiptItems(
  receiptId: string,
  items: Array<{
    category?: string
    name: string
    rawName?: string
    quantity: number
    unitPrice: number
  }>
) {
  await clearReceiptItems(receiptId)

  if (!items.length) {
    return []
  }

  const itemsData = await execute(InsertReceiptItemsMutation, {
    objects: items.map((item) => ({
      category: item.category || undefined,
      description: item.name,
      normalizedDescription: item.name,
      quantity: formatReceiptNumber(item.quantity),
      rawDescription: item.rawName?.trim() || item.name,
      receiptId,
      totalPrice: formatReceiptNumber(
        calculateItemTotal(item.quantity, item.unitPrice)
      ),
      unitPrice: formatReceiptNumber(item.unitPrice),
    })),
  })

  return itemsData.insertReceiptItems.returning
}

async function ensureProcessingReceipt(input: {
  companyId: string
  imageReference: string
  receiptId?: string
  userId: string
}) {
  if (input.receiptId) {
    const updatedReceipt = await updateReceipt({
      imageReference: input.imageReference,
      receiptDate: getTodayDate(),
      receiptId: input.receiptId,
      status: processingReceiptStatus,
      totalAmount: 0,
      userId: input.userId,
      vendorName: draftReceiptPlaceholderName,
      vendorTaxId: "",
    })

    await clearReceiptItems(input.receiptId)
    return updatedReceipt
  }

  const saved = await persistReceipt({
    companyId: input.companyId,
    imageReference: input.imageReference,
    items: [],
    receiptDate: getTodayDate(),
    status: processingReceiptStatus,
    totalAmount: 0,
    userId: input.userId,
    vendorName: draftReceiptPlaceholderName,
    vendorTaxId: "",
  })

  return saved.receipt
}

async function parseReceiptText(ocrText: string) {
  const provider = getParserProvider()
  const { output } = await generateText({
    model: provider(getParserModel()),
    output: Output.object({
      name: "ReceiptDraft",
      description: "Normalized receipt data extracted from OCR text.",
      schema: analyzedReceiptDraftSchema,
    }),
    prompt: `
Extract a normalized B2B receipt draft from the OCR text below.

Rules:
- Return receiptDate as YYYY-MM-DD.
- Return totalAmount, quantity, and unitPrice as numbers using decimal dots.
- Normalize product names into concise readable labels.
- Infer a short product category when possible. Use an empty string when unsure.
- If a CNPJ or vendor tax ID is visible, return digits only in vendorTaxId. Otherwise use an empty string.
- Include only purchased items. Ignore subtotals, taxes, payment lines, and metadata.
- Preserve the vendor name from the source text.
- If the OCR looks ambiguous, choose the most likely structured interpretation instead of inventing extra items.

OCR text:
${ocrText}
    `.trim(),
  })

  return output
}

async function runGeminiVisionOcr(input: {
  buffer: Buffer
  contentType?: string
}) {
  const visionProvider = getGoogleVisionProvider()
  const { text } = await generateText({
    model: visionProvider(getGoogleVisionModel()),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `
Read this receipt image and return plain OCR text only.

Rules:
- Transcribe all visible receipt text.
- Preserve useful line breaks.
- Do not summarize.
- Do not add markdown, code fences, labels, or explanations.
- If any part is unclear, still return the best raw transcription you can.
            `.trim(),
          },
          {
            type: "image",
            image: input.buffer,
            mediaType: input.contentType,
          },
        ],
      },
    ],
  })

  return text
}

async function runModalOcr(input: { buffer: Buffer }) {
  const response = await fetch(modalOcrEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_b64: input.buffer.toString("base64"),
    }),
  })

  if (!response.ok) {
    throw new Error(
      "O OCR do recibo falhou. Tente outra foto ou preencha os itens manualmente."
    )
  }

  const payload = (await response.json()) as { error?: string; text?: string }

  if (payload.error) {
    throw new Error(
      "O OCR do recibo falhou. Tente outra foto ou preencha os itens manualmente."
    )
  }

  return payload.text ?? ""
}

async function runOcr(input: {
  buffer: Buffer
  contentType?: string
  provider: OcrProvider
}) {
  const rawText =
    input.provider === "modal"
      ? await runModalOcr({ buffer: input.buffer })
      : await runGeminiVisionOcr({
          buffer: input.buffer,
          contentType: input.contentType,
        })

  const cleanedText = normalizeOcrText(rawText)

  if (!cleanedText) {
    throw new Error(
      "Não foi possível ler esta imagem com clareza. Tente outra foto ou preencha os itens manualmente."
    )
  }

  return cleanedText
}

function resolveOcrProvider(): OcrProvider {
  if (process.env.GOOGLE_AI_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return "gemini"
  }

  return "modal"
}

async function runOcrFromR2(input: { objectKey: string }) {
  const storedObject = await downloadReceiptObject(input.objectKey)

  return runOcr({
    buffer: storedObject.buffer,
    contentType: storedObject.contentType,
    provider: resolveOcrProvider(),
  })
}

async function runReceiptParsingJob(input: {
  objectKey: string
  receiptId: string
}) {
  try {
    const ocrText = await runOcrFromR2({ objectKey: input.objectKey })
    const parsedDraft = await parseReceiptText(ocrText)

    await replaceReceiptItems(input.receiptId, parsedDraft.items)
    await updateReceipt({
      receiptDate: parsedDraft.receiptDate,
      receiptId: input.receiptId,
      status: parsedReceiptStatus,
      totalAmount: parsedDraft.totalAmount,
      vendorName: parsedDraft.vendorName,
      vendorTaxId: parsedDraft.vendorTaxId,
    })
  } catch {
    await clearReceiptItems(input.receiptId)
    await updateReceipt({
      receiptId: input.receiptId,
      status: failedReceiptStatus,
    })
  }
}

type ReceiptParsingSubscriptionResult = {
  receiptsById?: {
    id: string
    receiptDate: string
    receiptItems?: Array<{
      category?: string | null
      description: string
      id: string
      quantity?: string | null
      totalPrice: string
      unitPrice: string
    }> | null
    status?: string | null
    totalAmount: string
    vendorName: string
    vendorTaxId?: string | null
  } | null
}

function toStreamPayload(
  receipt: NonNullable<ReceiptParsingSubscriptionResult["receiptsById"]>
) {
  return {
    draft:
      receipt.status === parsedReceiptStatus
        ? {
            items: (receipt.receiptItems ?? []).map((item) => ({
              category: item.category ?? "",
              name: item.description,
              quantity: Number.parseFloat(item.quantity ?? "0") || 0,
              unitPrice: Number.parseFloat(item.unitPrice) || 0,
            })),
            receiptDate: receipt.receiptDate,
            totalAmount: Number.parseFloat(receipt.totalAmount) || 0,
            vendorName: receipt.vendorName,
            vendorTaxId: receipt.vendorTaxId ?? "",
          }
        : null,
    receiptId: receipt.id,
    status: receipt.status ?? processingReceiptStatus,
  }
}

export const getScanBootstrap = createServerFn({ method: "GET" }).handler(
  async () => {
    const data = await execute(ScanBootstrapQuery)

    return {
      users: (data.users ?? []).map((user) => ({
        companyId: user.companyId,
        fullName: user.fullName,
        id: user.id,
      })),
    }
  }
)

export const createReceiptUploadUrl = createServerFn({ method: "POST" })
  .inputValidator((input) => createReceiptUploadInputSchema.parse(input))
  .handler(async ({ data }) => {
    return createPresignedReceiptUploadUrl(data)
  })

export const startReceiptParsing = createServerFn({ method: "POST" })
  .inputValidator((input) => analyzeReceiptInputSchema.parse(input))
  .handler(async ({ data }) => {
    const user = await fetchUserContext(data.userId)
    const imageReference = getStoredImageReference(data.objectKey)
    const receipt = await ensureProcessingReceipt({
      companyId: user.companyId,
      imageReference,
      receiptId: data.receiptId,
      userId: data.userId,
    })

    void runReceiptParsingJob({
      objectKey: data.objectKey,
      receiptId: receipt.id,
    })

    return {
      receiptId: receipt.id,
    }
  })

export const streamReceiptParsingStatus = createServerFn({ method: "GET" })
  .inputValidator((input) => graphQlUuidSchema.parse(input))
  .handler(async ({ data }) => {
    const encoder = new TextEncoder()

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        let closed = false

        const close = () => {
          if (closed) {
            return
          }

          closed = true
          controller.close()
        }

        const unsubscribe = subscribe(
          ReceiptParsingSubscription,
          { id: data },
          {
            next: (payload) => {
              if (payload.errors?.length) {
                controller.error(
                  new Error(
                    payload.errors
                      .map((error) => error.message)
                      .filter(Boolean)
                      .join("\n") ||
                      "A subscription do GraphQL retornou um erro desconhecido."
                  )
                )
                return
              }

              const receipt = payload.data?.receiptsById

              if (!receipt) {
                controller.error(
                  new Error("Não foi possível acompanhar o recibo solicitado.")
                )
                return
              }

              controller.enqueue(
                encoder.encode(`${JSON.stringify(toStreamPayload(receipt))}\n`)
              )

              if (
                receipt.status === parsedReceiptStatus ||
                receipt.status === failedReceiptStatus
              ) {
                unsubscribe()
                close()
              }
            },
            error: (error) => {
              controller.error(
                error instanceof Error
                  ? error
                  : new Error("Falha ao acompanhar o processamento do recibo.")
              )
            },
            complete: close,
          }
        )
      },
    })

    return new Response(stream, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/x-ndjson",
      },
    })
  })

export const saveReceiptDraft = createServerFn({ method: "POST" })
  .inputValidator((input) => saveReceiptInputSchema.parse(input))
  .handler(async ({ data }) => {
    const user = await fetchUserContext(data.userId)
    const imageReference = data.objectKey
      ? getStoredImageReference(data.objectKey)
      : undefined
    const saved = data.receiptId
      ? {
          items: await replaceReceiptItems(data.receiptId, data.items),
          receipt: await updateReceipt({
            imageReference,
            receiptDate: data.receiptDate,
            receiptId: data.receiptId,
            status: finalizedReceiptStatus,
            totalAmount: data.totalAmount,
            userId: data.userId,
            vendorName: data.vendorName,
            vendorTaxId: data.vendorTaxId,
          }),
        }
      : await persistReceipt({
          companyId: user.companyId,
          imageReference,
          items: data.items,
          receiptDate: data.receiptDate,
          status: finalizedReceiptStatus,
          totalAmount: data.totalAmount,
          userId: data.userId,
          vendorName: data.vendorName,
          vendorTaxId: data.vendorTaxId,
        })

    return {
      receiptId: saved.receipt.id,
      savedReceipt: saved,
    }
  })
