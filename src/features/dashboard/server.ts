import * as z from "zod"
import { createServerFn } from "@tanstack/react-start"

import type { TypedDocumentString } from "@/graphql/graphql"
import { DASHBOARD_CATEGORY_OPTIONS } from "@/features/dashboard/model"
import { graphQlUuidSchema } from "@/features/scan/types"
import { execute } from "@/graphql/execute"
import i18n, { preciseCurrencyFormatter } from "@/lib/i18n"
import { createSignedReceiptReadUrl } from "@/lib/r2"

const dashboardPeriodSchema = z.enum(["7d", "30d", "90d", "all"])

export type DashboardPeriod = z.infer<typeof dashboardPeriodSchema>

export type DashboardAlert = {
  id: string
  metric: string
  priority: number
  text: string
  userIds: Array<string>
}

export type DashboardCategoryRow = {
  key: string
  label: string
  ratio: number
  total: number
}

export type DashboardReceiptRow = {
  createdAt: string | null
  id: string
  itemCount: number
  primaryCategory: string
  primaryCategoryKey: string
  receiptDate: string
  totalAmount: number
  userId: string
  userName: string
  vendorName: string
}

export type DashboardEmployeeRow = {
  alertCount: number
  receiptCount: number
  receipts: Array<DashboardReceiptRow>
  topCategory: string
  totalSpent: number
  userId: string
  userName: string
}

export type DashboardProductRow = {
  employeeCount: number
  name: string
  purchaseCount: number
  totalQuantity: number
  totalSpent: number
}

export type DashboardSummary = {
  receiptsProcessed: number
  totalSpent: number
  uniqueEmployees: number
  uniqueProducts: number
}

export type DashboardSnapshot = {
  alerts: Array<DashboardAlert>
  categories: Array<DashboardCategoryRow>
  employees: Array<DashboardEmployeeRow>
  receipts: Array<DashboardReceiptRow>
  products: Array<DashboardProductRow>
  summary: DashboardSummary
}

export type DashboardReceiptDetail = {
  createdAt: string | null
  id: string
  imageRef: string | null
  items: Array<{
    category: string
    description: string
    id: string
    quantity: number
    rawDescription: string
    totalPrice: number
    unitPrice: number
  }>
  receiptDate: string
  status: string | null
  totalAmount: number
  userId: string
  userName: string
  vendorName: string
  vendorTaxId: string
  vendorTaxIdValid: boolean
}

export type DashboardReceiptDetailResult = {
  receipt: DashboardReceiptDetail
  signedImageUrl: string | null
}

type CompanyContextQuery = {
  users?: Array<{
    companyId: string
    id: string
  }> | null
}

type DashboardSnapshotQuery = {
  dashboardAlerts?: Array<{
    alertId: string
    alertType: string
    amount?: string | null
    category?: string | null
    countValue?: string | null
    employeeCount?: string | null
    limitAmount?: string | null
    maxPrice?: string | null
    minPrice?: string | null
    percentDelta?: string | null
    periodKey: string
    priority: string
    productName?: string | null
    receiptId?: string | null
    teamMedian?: string | null
    teamTotalSpent?: string | null
    userId: string
    userName?: string | null
    vendorName?: string | null
    vendorTaxId?: string | null
  }> | null
  dashboardCategorySpend?: Array<{
    category: string
    ratio: string
    totalSpent: string
  }> | null
  dashboardEmployeeSpend?: Array<{
    receiptCount: string
    topCategory: string
    totalSpent: string
    userId: string
    userName: string
  }> | null
  dashboardProducts?: Array<{
    employeeCount: string
    productName: string
    purchaseCount: string
    totalQuantity: string
    totalSpent: string
  }> | null
  dashboardReceiptHistory?: Array<{
    createdAt?: string | null
    itemCount: string
    primaryCategory: string
    receiptDate: string
    receiptId: string
    totalAmount: string
    userId: string
    userName: string
    vendorName: string
  }> | null
  dashboardSummary?: Array<{
    receiptsProcessed: string
    totalSpent: string
    uniqueEmployees: string
    uniqueProducts: string
  }> | null
}

type ReceiptDetailQuery = {
  receiptsById?: {
    createdAt?: string | null
    id: string
    imageUrl?: string | null
    receiptDate: string
    receiptItems?: Array<{
      category?: string | null
      description?: string | null
      normalizedDescription?: string | null
      quantity?: string | null
      rawDescription?: string | null
      id: string
      totalPrice: string
      unitPrice: string
    }> | null
    status?: string | null
    totalAmount: string
    userId: string
    user?: {
      fullName: string
    } | null
    vendorName: string
    vendorTaxId?: string | null
    vendorTaxIdValid: boolean
  } | null
}

const CompanyContextQueryDocument = `
  query DashboardCompanyContext {
    users(order_by: [{ fullName: Asc }]) {
      id
      companyId
    }
  }
` as unknown as TypedDocumentString<CompanyContextQuery, Record<string, never>>

const DashboardSnapshotQueryDocument = `
  query DashboardSnapshot($companyId: Uuid!, $periodKey: String1!) {
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
      order_by: [{ totalSpent: Desc }, { userName: Asc }]
    ) {
      userId
      userName
      receiptCount
      totalSpent
      topCategory
    }
    dashboardProducts(
      where: { companyId: { _eq: $companyId }, periodKey: { _eq: $periodKey } }
      order_by: [{ totalSpent: Desc }, { productName: Asc }]
    ) {
      productName
      purchaseCount
      employeeCount
      totalQuantity
      totalSpent
    }
    dashboardCategorySpend(
      where: { companyId: { _eq: $companyId }, periodKey: { _eq: $periodKey } }
      order_by: [{ totalSpent: Desc }]
    ) {
      category
      totalSpent
      ratio
    }
    dashboardAlerts(
      where: { companyId: { _eq: $companyId }, periodKey: { _eq: $periodKey } }
      order_by: [{ priority: Desc }, { alertId: Asc }]
    ) {
      alertId
      alertType
      amount
      category
      countValue
      employeeCount
      limitAmount
      maxPrice
      minPrice
      percentDelta
      periodKey
      priority
      productName
      receiptId
      teamMedian
      teamTotalSpent
      userId
      userName
      vendorName
      vendorTaxId
    }
    dashboardReceiptHistory(
      where: { companyId: { _eq: $companyId }, periodKey: { _eq: $periodKey } }
      order_by: [{ receiptDate: Desc }, { createdAt: Desc }]
    ) {
      createdAt
      itemCount
      primaryCategory
      receiptDate
      receiptId
      totalAmount
      userId
      userName
      vendorName
    }
  }
` as unknown as TypedDocumentString<
  DashboardSnapshotQuery,
  { companyId: string; periodKey: DashboardPeriod }
>

const ReceiptDetailQueryDocument = `
  query DashboardReceiptDetail($id: Uuid!) {
    receiptsById(id: $id) {
      id
      createdAt
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
      receiptItems(order_by: [{ totalPrice: Desc }, { normalizedDescription: Asc }]) {
        id
        category
        description
        normalizedDescription
        rawDescription
        quantity
        totalPrice
        unitPrice
      }
    }
  }
` as unknown as TypedDocumentString<ReceiptDetailQuery, { id: string }>

function toNumber(value: string | null | undefined) {
  const parsedValue = Number.parseFloat(value ?? "0")
  return Number.isFinite(parsedValue) ? parsedValue : 0
}

function toCount(value: string | null | undefined) {
  const parsedValue = Number.parseInt(value ?? "0", 10)
  return Number.isFinite(parsedValue) ? parsedValue : 0
}

function getCategoryLabel(categoryKey: string) {
  return (
    DASHBOARD_CATEGORY_OPTIONS.find((option) => option.key === categoryKey)
      ?.label ?? i18n.t("dashboard.labels.other")
  )
}

function buildAlertText(
  alert: NonNullable<DashboardSnapshotQuery["dashboardAlerts"]>[number]
) {
  switch (alert.alertType) {
    case "tax_invalid":
      return {
        metric:
          alert.vendorTaxId || i18n.t("dashboard.alerts.metrics.missingId"),
        text: i18n.t("dashboard.alerts.taxInvalid", {
          userName: alert.userName ?? "Funcionário desconhecido",
          vendorName: alert.vendorName ?? "Fornecedor desconhecido",
        }),
      }
    case "policy_exceeded":
      return {
        metric: i18n.t("dashboard.alerts.metrics.overLimit", {
          percent: Math.round(toNumber(alert.percentDelta)),
        }),
        text: i18n.t("dashboard.alerts.policyExceeded", {
          category: getCategoryLabel(alert.category ?? "other").toLowerCase(),
          categoryTotal: preciseCurrencyFormatter.format(
            toNumber(alert.amount)
          ),
          limitAmount: preciseCurrencyFormatter.format(
            toNumber(alert.limitAmount)
          ),
          userName: alert.userName ?? "Funcionário desconhecido",
          vendorName: alert.vendorName ?? "Fornecedor desconhecido",
        }),
      }
    case "policy_monthly_exceeded":
      return {
        metric: i18n.t("dashboard.alerts.metrics.overLimit", {
          percent: Math.round(toNumber(alert.percentDelta)),
        }),
        text: i18n.t("dashboard.alerts.policyMonthlyExceeded", {
          category: getCategoryLabel(alert.category ?? "other").toLowerCase(),
          totalSpent: preciseCurrencyFormatter.format(toNumber(alert.amount)),
          limitAmount: preciseCurrencyFormatter.format(
            toNumber(alert.limitAmount)
          ),
        }),
      }
    case "personal_purchase":
      return {
        metric: preciseCurrencyFormatter.format(toNumber(alert.amount)),
        text: i18n.t("dashboard.alerts.personalPurchase", {
          userName: alert.userName ?? "Funcionário desconhecido",
          vendorName: alert.vendorName ?? "Fornecedor desconhecido",
        }),
      }
    case "duplicate_receipts":
      return {
        metric: i18n.t("dashboard.alerts.metrics.duplicateReceipts", {
          count: toCount(alert.countValue),
        }),
        text: i18n.t("dashboard.alerts.duplicateReceipts", {
          count: toCount(alert.countValue),
          totalAmount: preciseCurrencyFormatter.format(toNumber(alert.amount)),
          vendorName: alert.vendorName ?? "Fornecedor desconhecido",
        }),
      }
    case "bulk_buying":
      return {
        metric: i18n.t("dashboard.alerts.metrics.repeatBuys", {
          count: toCount(alert.countValue),
        }),
        text: i18n.t("dashboard.alerts.bulkBuying", {
          count: toCount(alert.countValue),
          employeeCount: toCount(alert.employeeCount),
          productName: alert.productName ?? i18n.t("dashboard.labels.other"),
        }),
      }
    case "price_range":
      return {
        metric: i18n.t("dashboard.alerts.metrics.priceSpread", {
          percent: Math.round(toNumber(alert.percentDelta)),
        }),
        text: i18n.t("dashboard.alerts.priceRange", {
          maxPrice: preciseCurrencyFormatter.format(toNumber(alert.maxPrice)),
          minPrice: preciseCurrencyFormatter.format(toNumber(alert.minPrice)),
          productName: alert.productName ?? i18n.t("dashboard.labels.other"),
        }),
      }
    default:
      return {
        metric: "",
        text: "",
      }
  }
}

function groupAlerts(
  alerts: NonNullable<DashboardSnapshotQuery["dashboardAlerts"]>
) {
  const groupedAlerts = new Map<
    string,
    {
      id: string
      metric: string
      priority: number
      text: string
      userIds: Array<string>
    }
  >()

  for (const alert of alerts) {
    const existingAlert = groupedAlerts.get(alert.alertId)

    if (existingAlert) {
      if (!existingAlert.userIds.includes(alert.userId)) {
        existingAlert.userIds.push(alert.userId)
      }
      continue
    }

    const formattedAlert = buildAlertText(alert)

    groupedAlerts.set(alert.alertId, {
      id: alert.alertId,
      metric: formattedAlert.metric,
      priority: toNumber(alert.priority),
      text: formattedAlert.text,
      userIds: [alert.userId],
    })
  }

  return [...groupedAlerts.values()].sort(
    (left, right) => right.priority - left.priority
  )
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

export const getDashboardSnapshot = createServerFn({ method: "POST" })
  .inputValidator((input) => dashboardPeriodSchema.parse(input))
  .handler(async ({ data }) => {
    const companyContext = await execute(CompanyContextQueryDocument)
    const companyId = companyContext.users?.[0]?.companyId ?? null

    if (!companyId) {
      return {
        alerts: [],
        categories: DASHBOARD_CATEGORY_OPTIONS.map((option) => ({
          key: option.key,
          label: option.label,
          ratio: 0,
          total: 0,
        })),
        employees: [],
        receipts: [],
        products: [],
        summary: {
          receiptsProcessed: 0,
          totalSpent: 0,
          uniqueEmployees: 0,
          uniqueProducts: 0,
        },
      }
    }

    const dataSnapshot = await execute(DashboardSnapshotQueryDocument, {
      companyId,
      periodKey: data,
    })
    const alerts = groupAlerts(dataSnapshot.dashboardAlerts ?? [])
    const alertCountByUserId = new Map<string, number>()

    for (const alert of alerts) {
      for (const userId of alert.userIds) {
        alertCountByUserId.set(
          userId,
          (alertCountByUserId.get(userId) ?? 0) + 1
        )
      }
    }

    const receipts = (dataSnapshot.dashboardReceiptHistory ?? []).map(
      (receipt) => ({
        createdAt: receipt.createdAt ?? null,
        id: receipt.receiptId,
        itemCount: toCount(receipt.itemCount),
        primaryCategory: getCategoryLabel(receipt.primaryCategory),
        primaryCategoryKey: receipt.primaryCategory,
        receiptDate: receipt.receiptDate,
        totalAmount: toNumber(receipt.totalAmount),
        userId: receipt.userId,
        userName: receipt.userName,
        vendorName: receipt.vendorName,
      })
    )

    return {
      alerts,
      categories: DASHBOARD_CATEGORY_OPTIONS.map((option) => {
        const row = (dataSnapshot.dashboardCategorySpend ?? []).find(
          (category) => category.category === option.key
        )

        return {
          key: option.key,
          label: option.label,
          ratio: toNumber(row?.ratio),
          total: toNumber(row?.totalSpent),
        }
      }),
      employees: (dataSnapshot.dashboardEmployeeSpend ?? []).map(
        (employee) => ({
          alertCount: alertCountByUserId.get(employee.userId) ?? 0,
          receiptCount: toCount(employee.receiptCount),
          receipts: receipts.filter(
            (receipt) => receipt.userId === employee.userId
          ),
          topCategory: getCategoryLabel(employee.topCategory),
          totalSpent: toNumber(employee.totalSpent),
          userId: employee.userId,
          userName: employee.userName,
        })
      ),
      receipts,
      products: (dataSnapshot.dashboardProducts ?? []).map((product) => ({
        employeeCount: toCount(product.employeeCount),
        name: product.productName,
        purchaseCount: toCount(product.purchaseCount),
        totalQuantity: toNumber(product.totalQuantity),
        totalSpent: toNumber(product.totalSpent),
      })),
      summary: (() => {
        const summary = dataSnapshot.dashboardSummary?.[0]

        if (!summary) {
          return {
            receiptsProcessed: 0,
            totalSpent: 0,
            uniqueEmployees: 0,
            uniqueProducts: 0,
          }
        }

        return {
          receiptsProcessed: toCount(summary.receiptsProcessed),
          totalSpent: toNumber(summary.totalSpent),
          uniqueEmployees: toCount(summary.uniqueEmployees),
          uniqueProducts: toCount(summary.uniqueProducts),
        }
      })(),
    }
  })

export const getReceiptDetail = createServerFn({ method: "POST" })
  .inputValidator((input) => graphQlUuidSchema.parse(input))
  .handler(async ({ data }) => {
    const result = await execute(ReceiptDetailQueryDocument, { id: data })
    const receipt = result.receiptsById

    if (!receipt) {
      throw new Error("Não foi possível encontrar o recibo selecionado.")
    }

    const normalizedReceipt = {
      createdAt: receipt.createdAt ?? null,
      id: receipt.id,
      imageRef: receipt.imageUrl ?? null,
      items: (receipt.receiptItems ?? []).map((item) => ({
        category: item.category ?? "",
        description:
          item.normalizedDescription ?? item.description ?? "Item sem nome",
        id: item.id,
        quantity: toNumber(item.quantity),
        rawDescription: item.rawDescription ?? item.description ?? "",
        totalPrice: toNumber(item.totalPrice),
        unitPrice: toNumber(item.unitPrice),
      })),
      receiptDate: receipt.receiptDate,
      status: receipt.status ?? null,
      totalAmount: toNumber(receipt.totalAmount),
      userId: receipt.userId,
      userName: receipt.user?.fullName ?? "Funcionário desconhecido",
      vendorName: receipt.vendorName,
      vendorTaxId: receipt.vendorTaxId ?? "",
      vendorTaxIdValid: Boolean(receipt.vendorTaxIdValid),
    }
    const objectKey = normalizedReceipt.imageRef
      ? getObjectKeyFromImageReference(normalizedReceipt.imageRef)
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
      receipt: normalizedReceipt,
      signedImageUrl,
    }
  })
