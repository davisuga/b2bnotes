import { Output, generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import { createServerFn } from "@tanstack/react-start"
import * as z from "zod"

import type { TypedDocumentString } from "@/graphql/graphql"
import { graphql } from "@/graphql"
import { execute } from "@/graphql/execute"
import { subscribe } from "@/graphql/subscribe"
import {
  analyzeReceiptInputSchema,
  analyzedReceiptDraftSchema,
  createReceiptUploadInputSchema,
  graphQlUuidSchema,
  saveReceiptInputSchema,
} from "@/features/scan/types"
import {
  createPresignedReceiptUploadUrl,
  createSignedReceiptReadUrl,
  downloadReceiptObject,
  getStoredImageReference,
} from "@/lib/r2"
import {
  calculateItemTotal,
  getTodayDate,
  isValidBrazilCnpj,
  normalizeOcrText,
  normalizeVendorTaxId,
} from "@/features/scan/utils"

type OcrProvider = "gemini" | "modal"

type ScanLogLevel = "error" | "info" | "warn"

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

const ReceiptRawTextQuery = `
  query ScanReceiptRawText($id: Uuid!) {
    receiptsById(id: $id) {
      id
      rawText
    }
  }
` as unknown as TypedDocumentString<
  {
    receiptsById?: {
      id: string
      rawText?: string | null
    } | null
  },
  { id: string }
>

const DuplicateReceiptCandidatesQuery = `
  query ScanDuplicateReceiptCandidates(
    $companyId: Uuid!
    $receiptDate: Date!
    $totalAmount: Bigdecimal!
  ) {
    receipts(
      where: {
        companyId: { _eq: $companyId }
        receiptDate: { _eq: $receiptDate }
        totalAmount: { _eq: $totalAmount }
        status: { _neq: "processing" }
      }
      order_by: [{ createdAt: Desc }]
    ) {
      id
      vendorName
    }
  }
` as unknown as TypedDocumentString<
  {
    receipts?: Array<{
      id: string
      vendorName: string
    }> | null
  },
  {
    companyId: string
    receiptDate: string
    totalAmount: string
  }
>

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

const ScanReceiptDraftQuery = graphql(`
  query ScanReceiptDraft($id: Uuid!) {
    receiptsById(id: $id) {
      id
      imageUrl
      receiptDate
      status
      totalAmount
      userId
      vendorName
      vendorTaxId
      vendorTaxIdValid
      user {
        fullName
      }
      receiptItems(
        order_by: [{ totalPrice: Desc }, { normalizedDescription: Asc }]
      ) {
        id
        category
        description
        normalizedDescription
        rawDescription
        quantity
        unitPrice
        totalPrice
      }
    }
  }
`)

const draftReceiptPlaceholderName = "Processando recibo"
const processingReceiptStatus = "processing"
const parsedReceiptStatus = "extracted"
const finalizedReceiptStatus = "approved"
const failedReceiptStatus = "flagged"
const modalOcrEndpoint = "https://0xthiagomartins--glm-ocr-ocr.modal.run"
const duplicateFlaggedReason = "duplicate"
const personalPurchaseFlaggedReason = "personal_purchase"
const parseFailedFlaggedReason = "parse_failed"
const personalExpenseConfidenceThreshold = 0.85

function serializeScanError(error: unknown) {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      stack: error.stack,
    }
  }

  return {
    value: String(error),
  }
}

function logScanEvent(
  level: ScanLogLevel,
  event: string,
  details: Record<string, unknown> = {}
) {
  if (process.env.NODE_ENV === "test") {
    return
  }

  const payload = {
    details,
    event,
    level,
    scope: "receipt-scan",
    timestamp: new Date().toISOString(),
  }

  if (level === "error") {
    console.error(JSON.stringify(payload))
    return
  }

  if (level === "warn") {
    console.warn(JSON.stringify(payload))
    return
  }

  console.info(JSON.stringify(payload))
}

const personalExpenseClassificationSchema = z.object({
  confidence: z.number().min(0).max(1),
  primaryItemId: z.string().trim().optional().default(""),
  reason: z.string().trim().min(1).max(240),
  verdict: z.enum(["personal", "business", "uncertain"]),
})

type PersonalExpenseClassification = z.infer<
  typeof personalExpenseClassificationSchema
>

export function resolveReviewedReceiptFraudState(input: {
  hasDuplicateReceipt: boolean
  personalExpenseClassification?: PersonalExpenseClassification | null
}) {
  if (input.hasDuplicateReceipt) {
    return {
      flaggedReason: duplicateFlaggedReason,
      status: failedReceiptStatus,
    } as const
  }

  if (
    input.personalExpenseClassification?.verdict === "personal" &&
    input.personalExpenseClassification.confidence >=
      personalExpenseConfidenceThreshold
  ) {
    return {
      flaggedReason: personalPurchaseFlaggedReason,
      status: failedReceiptStatus,
    } as const
  }

  return {
    flaggedReason: null,
    status: finalizedReceiptStatus,
  } as const
}

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

function getPersonalExpenseModel() {
  if (process.env.GOOGLE_AI_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return (
      process.env.GOOGLE_AI_PERSONAL_EXPENSE_MODEL ??
      process.env.GOOGLE_AI_MODEL ??
      "gemini-2.5-flash"
    )
  }

  return (
    process.env.OPENAI_PERSONAL_EXPENSE_MODEL ??
    process.env.OPENAI_MODEL ??
    "gpt-4.1-mini"
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

function normalizeDuplicateVendorName(vendorName: string) {
  return vendorName
    .normalize("NFKD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, " ")
    .trim()
}

async function hasDuplicateReceipt(input: {
  companyId: string
  receiptDate: string
  receiptId?: string
  totalAmount: number
  vendorName: string
}) {
  const normalizedVendorName = normalizeDuplicateVendorName(input.vendorName)

  if (!normalizedVendorName) {
    return false
  }

  const data = await execute(DuplicateReceiptCandidatesQuery, {
    companyId: input.companyId,
    receiptDate: input.receiptDate,
    totalAmount: formatReceiptNumber(input.totalAmount),
  })

  return (data.receipts ?? []).some((receipt) => {
    if (receipt.id === input.receiptId) {
      return false
    }

    return (
      normalizeDuplicateVendorName(receipt.vendorName) === normalizedVendorName
    )
  })
}

async function persistReceipt(input: {
  companyId: string
  flaggedReason?: string | null
  imageReference?: string
  items: Array<{
    category?: string
    name: string
    rawName?: string
    quantity: number
    unitPrice: number
  }>
  receiptDate: string
  rawText?: string | null
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
        flaggedReason: input.flaggedReason ?? undefined,
        imageUrl: input.imageReference,
        rawText: input.rawText ?? undefined,
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
  flaggedReason?: string | null
  imageReference?: string
  rawText?: string | null
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

  if (input.rawText !== undefined) {
    updateColumns.rawText = {
      set: input.rawText,
    }
  }

  if (input.flaggedReason !== undefined) {
    updateColumns.flaggedReason = {
      set: input.flaggedReason,
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
      flaggedReason: null,
      rawText: null,
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
    flaggedReason: null,
    imageReference: input.imageReference,
    items: [],
    rawText: null,
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
  logScanEvent("info", "parse-text.started", {
    model: getParserModel(),
    ocrTextLength: ocrText.length,
  })

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

  logScanEvent("info", "parse-text.completed", {
    itemCount: output.items.length,
    receiptDate: output.receiptDate,
    totalAmount: output.totalAmount,
    vendorName: output.vendorName,
  })

  return output
}

async function runGeminiVisionOcr(input: {
  buffer: Buffer
  contentType?: string
}) {
  logScanEvent("info", "ocr.gemini.started", {
    bufferBytes: input.buffer.length,
    contentType: input.contentType ?? null,
    model: getGoogleVisionModel(),
  })

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

  logScanEvent("info", "ocr.gemini.completed", {
    textLength: text.length,
  })

  return text
}

async function runModalOcr(input: { buffer: Buffer }) {
  logScanEvent("info", "ocr.modal.started", {
    bufferBytes: input.buffer.length,
    endpoint: modalOcrEndpoint,
  })

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
    logScanEvent("warn", "ocr.modal.http-error", {
      status: response.status,
      statusText: response.statusText,
    })
    throw new Error(
      "O OCR do recibo falhou. Tente outra foto ou preencha os itens manualmente."
    )
  }

  const payload = (await response.json()) as { error?: string; text?: string }

  if (payload.error) {
    logScanEvent("warn", "ocr.modal.payload-error", {
      error: payload.error,
    })
    throw new Error(
      "O OCR do recibo falhou. Tente outra foto ou preencha os itens manualmente."
    )
  }

  logScanEvent("info", "ocr.modal.completed", {
    textLength: (payload.text ?? "").length,
  })

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

  logScanEvent("info", "ocr.cleaned", {
    cleanedTextLength: cleanedText.length,
    provider: input.provider,
  })

  return cleanedText
}

function resolveOcrProvider(): OcrProvider {
  if (process.env.GOOGLE_AI_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return "gemini"
  }

  return "modal"
}

async function runOcrFromR2(input: { objectKey: string }) {
  logScanEvent("info", "ocr.download.started", {
    objectKey: input.objectKey,
  })

  const storedObject = await downloadReceiptObject(input.objectKey)

  logScanEvent("info", "ocr.download.completed", {
    bufferBytes: storedObject.buffer.length,
    contentType: storedObject.contentType ?? null,
    objectKey: input.objectKey,
  })

  return runOcr({
    buffer: storedObject.buffer,
    contentType: storedObject.contentType,
    provider: resolveOcrProvider(),
  })
}

async function getReceiptRawText(receiptId: string) {
  const data = await execute(ReceiptRawTextQuery, { id: receiptId })
  return data.receiptsById?.rawText ?? null
}

async function classifyReceiptForPersonalExpense(input: {
  items: Array<{
    category?: string
    id: string
    name: string
    rawName?: string
    quantity: number
    unitPrice: number
  }>
  rawText?: string | null
  receiptDate: string
  totalAmount: number
  vendorName: string
  vendorTaxId?: string
}) {
  try {
    const provider = getParserProvider()
    const reviewedReceipt = {
      items: input.items.map((item) => ({
        category: item.category ?? "",
        id: item.id,
        lineTotal: calculateItemTotal(item.quantity, item.unitPrice),
        normalizedName: item.name,
        quantity: item.quantity,
        rawName: item.rawName?.trim() || item.name,
        unitPrice: item.unitPrice,
      })),
      rawText: input.rawText?.trim() || "",
      receiptDate: input.receiptDate,
      totalAmount: input.totalAmount,
      vendorName: input.vendorName,
      vendorTaxId: normalizeVendorTaxId(input.vendorTaxId ?? ""),
    }

    const { output } = await generateText({
      model: provider(getPersonalExpenseModel()),
      output: Output.object({
        name: "PersonalExpenseClassification",
        description:
          "Receipt-level decision about whether the reviewed receipt likely includes personal expenses.",
        schema: personalExpenseClassificationSchema,
      }),
      prompt: `
Classify whether this reviewed receipt clearly includes personal expenses.

Be conservative:
- Return "personal" only when the receipt clearly contains likely non-business or personal spending.
- Return "business" when the receipt is clearly consistent with normal business spending.
- Return "uncertain" when the evidence is mixed, weak, or ambiguous.
- Do not infer personal spending from generic retail vendors alone.
- Prefer "uncertain" over a false positive.
- If you return "personal", set primaryItemId to the strongest supporting item when possible.
- Confidence must be between 0 and 1 and should reflect how certain you are.

Reviewed receipt:
${JSON.stringify(reviewedReceipt, null, 2)}
      `.trim(),
      temperature: 0,
    })

    return output
  } catch {
    return null
  }
}

async function runReceiptParsingJob(input: {
  objectKey: string
  receiptId: string
}) {
  let ocrText: string | null = null

  try {
    logScanEvent("info", "job.started", {
      objectKey: input.objectKey,
      receiptId: input.receiptId,
      runtime: process.env.VERCEL ? "vercel" : "node",
    })

    ocrText = await runOcrFromR2({ objectKey: input.objectKey })
    const parsedDraft = await parseReceiptText(ocrText)

    await replaceReceiptItems(input.receiptId, parsedDraft.items)
    logScanEvent("info", "job.items-saved", {
      itemCount: parsedDraft.items.length,
      receiptId: input.receiptId,
    })

    await updateReceipt({
      flaggedReason: null,
      rawText: ocrText,
      receiptDate: parsedDraft.receiptDate,
      receiptId: input.receiptId,
      status: parsedReceiptStatus,
      totalAmount: parsedDraft.totalAmount,
      vendorName: parsedDraft.vendorName,
      vendorTaxId: parsedDraft.vendorTaxId,
    })

    logScanEvent("info", "job.completed", {
      receiptId: input.receiptId,
      status: parsedReceiptStatus,
      totalAmount: parsedDraft.totalAmount,
      vendorName: parsedDraft.vendorName,
    })
  } catch (error) {
    logScanEvent("error", "job.failed", {
      error: serializeScanError(error),
      hasRawText: Boolean(ocrText),
      objectKey: input.objectKey,
      receiptId: input.receiptId,
    })

    await clearReceiptItems(input.receiptId)
    await updateReceipt({
      flaggedReason: parseFailedFlaggedReason,
      rawText: ocrText,
      receiptId: input.receiptId,
      status: failedReceiptStatus,
    })

    logScanEvent("warn", "job.flagged", {
      flaggedReason: parseFailedFlaggedReason,
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

type ScanReceiptDraftQueryResult = {
  receiptsById?: {
    id: string
    imageUrl?: string | null
    receiptDate: string
    status?: string | null
    totalAmount: string
    userId: string
    vendorName: string
    vendorTaxId?: string | null
    vendorTaxIdValid: boolean
    user?: {
      fullName: string
    } | null
    receiptItems?: Array<{
      id: string
      category?: string | null
      description?: string | null
      normalizedDescription?: string | null
      rawDescription?: string | null
      quantity?: string | null
      unitPrice: string
      totalPrice: string
    }> | null
  } | null
}

export type ScanReceiptDraftResult = {
  draft: {
    items: Array<{
      category: string
      id: string
      name: string
      quantity: number
      rawName: string
      unitPrice: number
    }>
    receiptDate: string
    totalAmount: number
    vendorName: string
    vendorTaxId: string
  }
  objectKey: string | null
  receipt: {
    id: string
    status: string
    userId: string
    userName: string
    vendorTaxIdValid: boolean
  }
  signedImageUrl: string | null
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

function getObjectKeyFromImageReference(imageReference: string) {
  if (!imageReference.startsWith("r2://")) {
    return null
  }

  const remainder = imageReference.slice("r2://".length)
  const slashIndex = remainder.indexOf("/")

  if (slashIndex === -1) {
    return null
  }

  return remainder.slice(slashIndex + 1) || null
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
    logScanEvent("info", "upload-url.requested", {
      contentType: data.contentType,
      fileName: data.fileName,
      userId: data.userId,
    })

    return createPresignedReceiptUploadUrl(data)
  })

export const startReceiptParsing = createServerFn({ method: "POST" })
  .inputValidator((input) => analyzeReceiptInputSchema.parse(input))
  .handler(async ({ data }) => {
    logScanEvent("info", "start-parsing.requested", {
      objectKey: data.objectKey,
      receiptId: data.receiptId ?? null,
      runtime: process.env.VERCEL ? "vercel" : "node",
      userId: data.userId,
    })

    const user = await fetchUserContext(data.userId)
    const imageReference = getStoredImageReference(data.objectKey)
    const receipt = await ensureProcessingReceipt({
      companyId: user.companyId,
      imageReference,
      receiptId: data.receiptId,
      userId: data.userId,
    })

    logScanEvent("info", "start-parsing.receipt-ready", {
      companyId: user.companyId,
      imageReference,
      objectKey: data.objectKey,
      receiptId: receipt.id,
    })

    void runReceiptParsingJob({
      objectKey: data.objectKey,
      receiptId: receipt.id,
    })

    logScanEvent("info", "start-parsing.job-dispatched", {
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

        logScanEvent("info", "status-stream.opened", {
          receiptId: data,
          runtime: process.env.VERCEL ? "vercel" : "node",
        })

        const close = () => {
          if (closed) {
            return
          }

          closed = true
          logScanEvent("info", "status-stream.closed", {
            receiptId: data,
          })
          controller.close()
        }

        const unsubscribe = subscribe(
          ReceiptParsingSubscription,
          { id: data },
          {
            next: (payload) => {
              if (payload.errors?.length) {
                logScanEvent("error", "status-stream.subscription-errors", {
                  errors: payload.errors.map((error) => error.message),
                  receiptId: data,
                })
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
                logScanEvent("error", "status-stream.missing-receipt", {
                  receiptId: data,
                })
                controller.error(
                  new Error("Não foi possível acompanhar o recibo solicitado.")
                )
                return
              }

              logScanEvent("info", "status-stream.event", {
                itemCount: receipt.receiptItems?.length ?? 0,
                receiptId: receipt.id,
                status: receipt.status ?? processingReceiptStatus,
              })

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
              logScanEvent("error", "status-stream.subscription-failed", {
                error: serializeScanError(error),
                receiptId: data,
              })
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
    const isDuplicateReceipt = await hasDuplicateReceipt({
      companyId: user.companyId,
      receiptDate: data.receiptDate,
      receiptId: data.receiptId,
      totalAmount: data.totalAmount,
      vendorName: data.vendorName,
    })
    const rawText = data.receiptId
      ? await getReceiptRawText(data.receiptId)
      : null
    const personalExpenseClassification = isDuplicateReceipt
      ? null
      : await classifyReceiptForPersonalExpense({
          items: data.items,
          rawText,
          receiptDate: data.receiptDate,
          totalAmount: data.totalAmount,
          vendorName: data.vendorName,
          vendorTaxId: data.vendorTaxId,
        })
    const reviewedReceiptFraudState = resolveReviewedReceiptFraudState({
      hasDuplicateReceipt: isDuplicateReceipt,
      personalExpenseClassification,
    })
    const saved = data.receiptId
      ? {
          items: await replaceReceiptItems(data.receiptId, data.items),
          receipt: await updateReceipt({
            flaggedReason: reviewedReceiptFraudState.flaggedReason,
            imageReference,
            receiptDate: data.receiptDate,
            receiptId: data.receiptId,
            status: reviewedReceiptFraudState.status,
            totalAmount: data.totalAmount,
            userId: data.userId,
            vendorName: data.vendorName,
            vendorTaxId: data.vendorTaxId,
          }),
        }
      : await persistReceipt({
          companyId: user.companyId,
          flaggedReason: reviewedReceiptFraudState.flaggedReason,
          imageReference,
          items: data.items,
          receiptDate: data.receiptDate,
          status: reviewedReceiptFraudState.status,
          totalAmount: data.totalAmount,
          userId: data.userId,
          vendorName: data.vendorName,
          vendorTaxId: data.vendorTaxId,
        })

    return {
      receiptId: saved.receipt.id,
    }
  })

export const getScanReceiptDraft = createServerFn({ method: "GET" })
  .inputValidator((input) => graphQlUuidSchema.parse(input))
  .handler(async ({ data }) => {
    const result = (await execute(ScanReceiptDraftQuery, {
      id: data,
    })) as ScanReceiptDraftQueryResult
    const receipt = result.receiptsById

    if (!receipt) {
      throw new Error("Não foi possível encontrar o recibo selecionado.")
    }

    const objectKey = receipt.imageUrl
      ? getObjectKeyFromImageReference(receipt.imageUrl)
      : null

    let signedImageUrl: string | null = null

    if (objectKey) {
      try {
        signedImageUrl = await createSignedReceiptReadUrl(objectKey)
      } catch {
        signedImageUrl = null
      }
    }

    return {
      draft: {
        items: (receipt.receiptItems ?? []).map((item) => ({
          category: item.category ?? "",
          id: item.id,
          name:
            item.normalizedDescription ?? item.description ?? "Item sem nome",
          quantity: Number.parseFloat(item.quantity ?? "0") || 0,
          rawName: item.rawDescription ?? item.description ?? "",
          unitPrice: Number.parseFloat(item.unitPrice) || 0,
        })),
        receiptDate: receipt.receiptDate,
        totalAmount: Number.parseFloat(receipt.totalAmount) || 0,
        vendorName: receipt.vendorName,
        vendorTaxId: receipt.vendorTaxId ?? "",
      },
      objectKey,
      receipt: {
        id: receipt.id,
        status: receipt.status ?? processingReceiptStatus,
        userId: receipt.userId,
        userName: receipt.user?.fullName ?? "Funcionário desconhecido",
        vendorTaxIdValid: receipt.vendorTaxIdValid,
      },
      signedImageUrl,
    } satisfies ScanReceiptDraftResult
  })
