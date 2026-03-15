import i18n, { preciseCurrencyFormatter } from "@/lib/i18n"

export type DashboardPeriod = "7d" | "30d" | "90d" | "all"

export type DashboardCategoryKey =
  | "food"
  | "fuel"
  | "office-supplies"
  | "cleaning"
  | "other"

export type DashboardUser = {
  companyId: string
  fullName: string
  id: string
}

export type DashboardPolicyLimit = {
  category: DashboardCategoryKey
  companyId: string
  id: string
  maxPerMonth: number | null
  maxPerTransaction: number | null
}

export type DashboardReceiptItem = {
  category: string
  description: string
  id: string
  rawDescription?: string
  quantity: number
  totalPrice: number
  unitPrice: number
}

export type DashboardReceipt = {
  createdAt: string | null
  id: string
  imageRef: string | null
  items: DashboardReceiptItem[]
  receiptDate: string
  status: string | null
  totalAmount: number
  flaggedReason?: string | null
  rawText?: string | null
  userId: string
  userName: string
  vendorName: string
  vendorTaxId: string
  vendorTaxIdValid: boolean
}

export type DashboardBootstrap = {
  companyId: string | null
  policyLimits: DashboardPolicyLimit[]
  receipts: DashboardReceipt[]
  users: DashboardUser[]
}

export type DashboardAlert = {
  id: string
  metric: string
  priority: number
  text: string
  userIds: string[]
}

export type DashboardCategoryBreakdown = {
  key: DashboardCategoryKey
  label: string
  ratio: number
  total: number
}

export type DashboardEmployeeSpend = {
  alertCount: number
  receiptCount: number
  receipts: DashboardReceipt[]
  topCategory: string
  totalSpent: number
  userId: string
  userName: string
}

export type DashboardPolicyRow = {
  breachCount: number
  category: DashboardCategoryKey
  label: string
  limitAmount: number | null
  totalSpent: number
}

export type DashboardProductRow = {
  employeeCount: number
  name: string
  purchaseCount: number
  totalQuantity: number
  totalSpent: number
}

export type DashboardView = {
  alerts: DashboardAlert[]
  categories: DashboardCategoryBreakdown[]
  employees: DashboardEmployeeSpend[]
  filteredReceipts: DashboardReceipt[]
  policyRows: DashboardPolicyRow[]
  products: DashboardProductRow[]
  summary: {
    receiptsProcessed: number
    totalSpent: number
    uniqueEmployees: number
    uniqueProducts: number
  }
}

export const DASHBOARD_PERIODS: Array<{ id: DashboardPeriod; label: string }> =
  [
    { id: "7d", label: i18n.t("dashboard.periods.7d") },
    { id: "30d", label: i18n.t("dashboard.periods.30d") },
    { id: "90d", label: i18n.t("dashboard.periods.90d") },
    { id: "all", label: i18n.t("dashboard.periods.all") },
  ]

export const DASHBOARD_CATEGORY_OPTIONS: Array<{
  defaultLimit: number
  key: DashboardCategoryKey
  label: string
}> = [
  {
    key: "food",
    label: i18n.t("dashboard.categories.food"),
    defaultLimit: 50,
  },
  {
    key: "fuel",
    label: i18n.t("dashboard.categories.fuel"),
    defaultLimit: 150,
  },
  {
    key: "office-supplies",
    label: i18n.t("dashboard.categories.office-supplies"),
    defaultLimit: 120,
  },
  {
    key: "cleaning",
    label: i18n.t("dashboard.categories.cleaning"),
    defaultLimit: 90,
  },
  {
    key: "other",
    label: i18n.t("dashboard.categories.other"),
    defaultLimit: 75,
  },
]

const PERIOD_LENGTHS: Record<Exclude<DashboardPeriod, "all">, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
}

const CATEGORY_KEYWORDS: Array<{
  key: DashboardCategoryKey
  keywords: string[]
}> = [
  {
    key: "food",
    keywords: [
      "food",
      "meal",
      "lunch",
      "breakfast",
      "dinner",
      "restaurant",
      "grocery",
      "pantry",
      "snack",
      "beverage",
      "coffee",
      "alimento",
      "alimentação",
      "refeicao",
      "refeição",
      "almoco",
      "almoço",
      "jantar",
      "mercado",
      "lanche",
      "bebida",
      "cafe",
      "café",
    ],
  },
  {
    key: "fuel",
    keywords: [
      "fuel",
      "gas",
      "gasoline",
      "diesel",
      "petrol",
      "station",
      "combustivel",
      "combustível",
      "gasolina",
      "etanol",
      "posto",
    ],
  },
  {
    key: "office-supplies",
    keywords: [
      "office",
      "stationery",
      "paper",
      "printer",
      "ink",
      "toner",
      "supply",
      "supplies",
      "escritorio",
      "escritório",
      "papelaria",
      "material",
      "suprimento",
      "suprimentos",
    ],
  },
  {
    key: "cleaning",
    keywords: [
      "clean",
      "cleaning",
      "detergent",
      "soap",
      "bleach",
      "sanitizer",
      "disinfectant",
      "limpeza",
      "detergente",
      "sabao",
      "sabão",
      "agua sanitaria",
      "água sanitária",
      "sanitizante",
      "desinfetante",
    ],
  },
]

const PERSONAL_KEYWORDS = [
  "personal",
  "cosmetic",
  "beauty",
  "makeup",
  "perfume",
  "shampoo",
  "conditioner",
  "deodorant",
  "toothpaste",
  "toothbrush",
  "razor",
  "skincare",
  "pet",
  "baby",
  "diaper",
  "toy",
  "alcohol",
  "beer",
  "wine",
  "cigarette",
  "tobacco",
  "pharmacy",
  "medicine",
  "medication",
  "clothing",
  "shirt",
  "shoe",
  "pessoal",
  "cosmetico",
  "cosmético",
  "beleza",
  "perfume",
  "desodorante",
  "escova de dente",
  "pasta de dente",
  "barbeador",
  "pele",
  "pet",
  "bebe",
  "bebê",
  "fralda",
  "brinquedo",
  "cerveja",
  "vinho",
  "cigarro",
  "tabaco",
  "farmacia",
  "farmácia",
  "remedio",
  "remédio",
  "medicamento",
  "roupa",
  "camisa",
  "sapato",
]

type ProductAggregate = DashboardProductRow & {
  employeeIds: Set<string>
  maxUnitPrice: number
  minUnitPrice: number
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100
}

function normalizeText(value: string) {
  return value.trim().toLowerCase()
}

function toDateValue(date: string) {
  const [year, month, day] = date.split("-").map(Number)
  return Date.UTC(year, (month || 1) - 1, day || 1)
}

function getTodayDateValue(now: Date) {
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
}

function getPeriodStartValue(period: DashboardPeriod, now: Date) {
  if (period === "all") {
    return Number.NEGATIVE_INFINITY
  }

  const todayValue = getTodayDateValue(now)
  const days = PERIOD_LENGTHS[period]
  return todayValue - (days - 1) * 24 * 60 * 60 * 1000
}

export function normalizeDashboardCategory(input: {
  category: string
  description: string
}): DashboardCategoryKey {
  const source = `${input.category} ${input.description}`.trim().toLowerCase()

  for (const definition of CATEGORY_KEYWORDS) {
    if (definition.keywords.some((keyword) => source.includes(keyword))) {
      return definition.key
    }
  }

  return "other"
}

function getCategoryLabel(category: DashboardCategoryKey) {
  return (
    DASHBOARD_CATEGORY_OPTIONS.find((option) => option.key === category)
      ?.label ?? i18n.t("dashboard.labels.other")
  )
}

export function getPrimaryReceiptCategory(receipt: DashboardReceipt) {
  return getCategoryLabel(getPrimaryReceiptCategoryKey(receipt))
}

export function getPrimaryReceiptCategoryKey(
  receipt: DashboardReceipt
): DashboardCategoryKey {
  const rankedCategories = [
    ...getReceiptCategoryTotals(receipt).entries(),
  ].sort((left, right) => right[1] - left[1])

  if (!rankedCategories.length) {
    return "other"
  }

  return rankedCategories[0]![0]
}

function getTopCategory(receipts: DashboardReceipt[]) {
  const categoryTotals = new Map<DashboardCategoryKey, number>()

  for (const receipt of receipts) {
    for (const item of receipt.items) {
      const category = normalizeDashboardCategory(item)
      categoryTotals.set(
        category,
        (categoryTotals.get(category) ?? 0) + item.totalPrice
      )
    }
  }

  const rankedCategories = [...categoryTotals.entries()].sort(
    (left, right) => right[1] - left[1]
  )

  if (!rankedCategories.length) {
    return i18n.t("dashboard.labels.other")
  }

  return getCategoryLabel(rankedCategories[0]![0])
}

function isLikelyPersonalItem(item: DashboardReceiptItem) {
  const source = `${item.category} ${item.description}`.trim().toLowerCase()
  return PERSONAL_KEYWORDS.some((keyword) => source.includes(keyword))
}

function getReceiptCategoryTotals(receipt: DashboardReceipt) {
  const totals = new Map<DashboardCategoryKey, number>()

  for (const item of receipt.items) {
    const category = normalizeDashboardCategory(item)
    totals.set(category, (totals.get(category) ?? 0) + item.totalPrice)
  }

  return totals
}

function getPolicyMap(policyLimits: DashboardPolicyLimit[]) {
  return new Map(policyLimits.map((policy) => [policy.category, policy]))
}

function getMedian(values: number[]) {
  if (!values.length) {
    return null
  }

  const sortedValues = [...values].sort((left, right) => left - right)
  const middleIndex = Math.floor(sortedValues.length / 2)

  if (sortedValues.length % 2 === 0) {
    return (sortedValues[middleIndex - 1]! + sortedValues[middleIndex]!) / 2
  }

  return sortedValues[middleIndex]!
}

function buildProductAggregates(receipts: DashboardReceipt[]) {
  const productMap = new Map<string, ProductAggregate>()

  for (const receipt of receipts) {
    for (const item of receipt.items) {
      const key = normalizeText(item.description)
      const existingProduct = productMap.get(key)

      if (existingProduct) {
        existingProduct.employeeIds.add(receipt.userId)
        existingProduct.purchaseCount += 1
        existingProduct.totalQuantity = roundCurrency(
          existingProduct.totalQuantity + item.quantity
        )
        existingProduct.totalSpent = roundCurrency(
          existingProduct.totalSpent + item.totalPrice
        )
        existingProduct.minUnitPrice = Math.min(
          existingProduct.minUnitPrice,
          item.unitPrice
        )
        existingProduct.maxUnitPrice = Math.max(
          existingProduct.maxUnitPrice,
          item.unitPrice
        )
        continue
      }

      productMap.set(key, {
        employeeCount: 1,
        employeeIds: new Set([receipt.userId]),
        maxUnitPrice: item.unitPrice,
        minUnitPrice: item.unitPrice,
        name: item.description,
        purchaseCount: 1,
        totalQuantity: item.quantity,
        totalSpent: item.totalPrice,
      })
    }
  }

  for (const product of productMap.values()) {
    product.employeeCount = product.employeeIds.size
  }

  return productMap
}

function buildEmployees(filteredReceipts: DashboardReceipt[]) {
  return [
    ...new Map(
      filteredReceipts.map((receipt) => [receipt.userId, receipt.userName])
    ).entries(),
  ]
    .map(([userId, userName]) => {
      const receipts = filteredReceipts.filter(
        (receipt) => receipt.userId === userId
      )

      return {
        alertCount: 0,
        userId,
        userName,
        receiptCount: receipts.length,
        receipts,
        totalSpent: roundCurrency(
          receipts.reduce((sum, receipt) => sum + receipt.totalAmount, 0)
        ),
        topCategory: getTopCategory(receipts),
      }
    })
    .sort((left, right) => right.totalSpent - left.totalSpent)
}

function buildPolicyRows(
  filteredReceipts: DashboardReceipt[],
  policyLimits: DashboardPolicyLimit[]
) {
  const policyMap = getPolicyMap(policyLimits)

  return DASHBOARD_CATEGORY_OPTIONS.map((option) => {
    const policy = policyMap.get(option.key)
    const totalSpent = roundCurrency(
      filteredReceipts.reduce((sum, receipt) => {
        return sum + (getReceiptCategoryTotals(receipt).get(option.key) ?? 0)
      }, 0)
    )
    const limitAmount = policy?.maxPerTransaction ?? null
    const breachCount = limitAmount
      ? filteredReceipts.reduce((count, receipt) => {
          return (
            count +
            ((getReceiptCategoryTotals(receipt).get(option.key) ?? 0) >
            limitAmount
              ? 1
              : 0)
          )
        }, 0)
      : 0

    return {
      breachCount,
      category: option.key,
      label: option.label,
      limitAmount,
      totalSpent,
    }
  })
}

function buildAlerts(input: {
  employees: DashboardEmployeeSpend[]
  filteredReceipts: DashboardReceipt[]
  policyLimits: DashboardPolicyLimit[]
  productMap: Map<string, ProductAggregate>
}) {
  const alerts: DashboardAlert[] = []
  const policyMap = getPolicyMap(input.policyLimits)
  const duplicateGroups = new Map<string, DashboardReceipt[]>()

  for (const receipt of input.filteredReceipts) {
    const duplicateKey = `${normalizeText(receipt.vendorName)}::${receipt.totalAmount.toFixed(2)}`
    duplicateGroups.set(duplicateKey, [
      ...(duplicateGroups.get(duplicateKey) ?? []),
      receipt,
    ])

    if (!receipt.vendorTaxIdValid) {
      alerts.push({
        id: `tax:${receipt.id}`,
        metric:
          receipt.vendorTaxId || i18n.t("dashboard.alerts.metrics.missingId"),
        priority: receipt.vendorTaxId ? 88 : 92,
        text: i18n.t("dashboard.alerts.taxInvalid", {
          userName: receipt.userName,
          vendorName: receipt.vendorName,
        }),
        userIds: [receipt.userId],
      })
    }

    const categoryTotals = getReceiptCategoryTotals(receipt)

    for (const [category, categoryTotal] of categoryTotals.entries()) {
      const limitAmount = policyMap.get(category)?.maxPerTransaction ?? null

      if (!limitAmount || categoryTotal <= limitAmount) {
        continue
      }

      alerts.push({
        id: `policy:${receipt.id}:${category}`,
        metric: i18n.t("dashboard.alerts.metrics.overLimit", {
          percent: Math.round(
            ((categoryTotal - limitAmount) / limitAmount) * 100
          ),
        }),
        priority: 100 + (categoryTotal - limitAmount),
        text: i18n.t("dashboard.alerts.policyExceeded", {
          category: getCategoryLabel(category).toLowerCase(),
          categoryTotal: preciseCurrencyFormatter.format(categoryTotal),
          limitAmount: preciseCurrencyFormatter.format(limitAmount),
          userName: receipt.userName,
          vendorName: receipt.vendorName,
        }),
        userIds: [receipt.userId],
      })
    }

    for (const item of receipt.items) {
      if (!isLikelyPersonalItem(item)) {
        continue
      }

      alerts.push({
        id: `personal:${item.id}`,
        metric: preciseCurrencyFormatter.format(item.totalPrice),
        priority: 70 + item.totalPrice,
        text: i18n.t("dashboard.alerts.personalPurchase", {
          itemDescription: item.description,
          userName: receipt.userName,
          vendorName: receipt.vendorName,
        }),
        userIds: [receipt.userId],
      })
    }
  }

  for (const option of DASHBOARD_CATEGORY_OPTIONS) {
    const limitAmount = policyMap.get(option.key)?.maxPerMonth ?? null

    if (!limitAmount) {
      continue
    }

    const receiptsInCategory = input.filteredReceipts.filter((receipt) =>
      getReceiptCategoryTotals(receipt).has(option.key)
    )
    const totalSpent = roundCurrency(
      receiptsInCategory.reduce((sum, receipt) => {
        return sum + (getReceiptCategoryTotals(receipt).get(option.key) ?? 0)
      }, 0)
    )

    if (totalSpent <= limitAmount) {
      continue
    }

    alerts.push({
      id: `policy-month:${option.key}`,
      metric: i18n.t("dashboard.alerts.metrics.overLimit", {
        percent: Math.round(((totalSpent - limitAmount) / limitAmount) * 100),
      }),
      priority: 95 + (totalSpent - limitAmount),
      text: i18n.t("dashboard.alerts.policyMonthlyExceeded", {
        category: option.label.toLowerCase(),
        limitAmount: preciseCurrencyFormatter.format(limitAmount),
        totalSpent: preciseCurrencyFormatter.format(totalSpent),
      }),
      userIds: [...new Set(receiptsInCategory.map((receipt) => receipt.userId))],
    })
  }

  for (const group of duplicateGroups.values()) {
    if (group.length < 2) {
      continue
    }

    const newestReceipt = [...group].sort((left, right) =>
      right.receiptDate.localeCompare(left.receiptDate)
    )[0]!

    alerts.push({
      id: `duplicate:${normalizeText(newestReceipt.vendorName)}:${newestReceipt.totalAmount.toFixed(2)}`,
      metric: i18n.t("dashboard.alerts.metrics.duplicateReceipts", {
        count: group.length,
      }),
      priority: 85 + group.length * 5,
      text: i18n.t("dashboard.alerts.duplicateReceipts", {
        count: group.length,
        totalAmount: preciseCurrencyFormatter.format(newestReceipt.totalAmount),
        vendorName: newestReceipt.vendorName,
      }),
      userIds: [...new Set(group.map((receipt) => receipt.userId))],
    })
  }

  for (const product of input.productMap.values()) {
    if (
      product.purchaseCount >= 4 &&
      product.employeeCount >= 2 &&
      product.totalQuantity <= product.purchaseCount * 3
    ) {
      alerts.push({
        id: `bulk:${normalizeText(product.name)}`,
        metric: i18n.t("dashboard.alerts.metrics.repeatBuys", {
          count: product.purchaseCount,
        }),
        priority: 60 + product.purchaseCount * 4,
        text: i18n.t("dashboard.alerts.bulkBuying", {
          count: product.purchaseCount,
          employeeCount: product.employeeCount,
          productName: product.name,
        }),
        userIds: [...product.employeeIds],
      })
    }

    if (
      product.employeeCount >= 2 &&
      product.purchaseCount >= 2 &&
      product.minUnitPrice > 0 &&
      product.maxUnitPrice >= product.minUnitPrice * 1.35 &&
      product.maxUnitPrice - product.minUnitPrice >= 5
    ) {
      alerts.push({
        id: `price:${normalizeText(product.name)}`,
        metric: i18n.t("dashboard.alerts.metrics.priceSpread", {
          percent: Math.round(
            ((product.maxUnitPrice - product.minUnitPrice) /
              product.minUnitPrice) *
              100
          ),
        }),
        priority: 65 + (product.maxUnitPrice - product.minUnitPrice),
        text: i18n.t("dashboard.alerts.priceRange", {
          maxPrice: preciseCurrencyFormatter.format(product.maxUnitPrice),
          minPrice: preciseCurrencyFormatter.format(product.minUnitPrice),
          productName: product.name,
        }),
        userIds: [...product.employeeIds],
      })
    }
  }

  const teamMedian = getMedian(
    input.employees.map((employee) => employee.totalSpent)
  )

  if (teamMedian && teamMedian > 0) {
    for (const employee of input.employees) {
      if (
        employee.totalSpent <= teamMedian * 1.75 ||
        employee.totalSpent - teamMedian < 100
      ) {
        continue
      }

      alerts.push({
        id: `peer:${employee.userId}`,
        metric: i18n.t("dashboard.alerts.metrics.overPeers", {
          percent: Math.round(
            ((employee.totalSpent - teamMedian) / teamMedian) * 100
          ),
        }),
        priority: 75 + (employee.totalSpent - teamMedian),
        text: i18n.t("dashboard.alerts.peerOverspend", {
          teamMedian: preciseCurrencyFormatter.format(teamMedian),
          totalSpent: preciseCurrencyFormatter.format(employee.totalSpent),
          userName: employee.userName,
        }),
        userIds: [employee.userId],
      })
    }
  }

  return alerts.sort((left, right) => right.priority - left.priority)
}

export function buildDashboardView(
  input: DashboardBootstrap,
  period: DashboardPeriod,
  now = new Date()
): DashboardView {
  const periodStartValue = getPeriodStartValue(period, now)
  const filteredReceipts = [...input.receipts]
    .filter((receipt) => toDateValue(receipt.receiptDate) >= periodStartValue)
    .sort((left, right) => {
      const dateDifference =
        toDateValue(right.receiptDate) - toDateValue(left.receiptDate)

      if (dateDifference !== 0) {
        return dateDifference
      }

      return (right.createdAt ?? "").localeCompare(left.createdAt ?? "")
    })

  const totalSpent = roundCurrency(
    filteredReceipts.reduce((sum, receipt) => sum + receipt.totalAmount, 0)
  )
  const uniqueEmployees = new Set(
    filteredReceipts.map((receipt) => receipt.userId)
  ).size
  const uniqueProducts = new Set(
    filteredReceipts.flatMap((receipt) =>
      receipt.items.map((item) => normalizeText(item.description))
    )
  ).size

  const employees = buildEmployees(filteredReceipts)
  const productMap = buildProductAggregates(filteredReceipts)
  const alerts = buildAlerts({
    employees,
    filteredReceipts,
    policyLimits: input.policyLimits,
    productMap,
  })
  const employeeAlertCounts = new Map<string, number>()

  for (const alert of alerts) {
    for (const userId of alert.userIds) {
      employeeAlertCounts.set(
        userId,
        (employeeAlertCounts.get(userId) ?? 0) + 1
      )
    }
  }

  const employeesWithAlerts = employees.map((employee) => ({
    ...employee,
    alertCount: employeeAlertCounts.get(employee.userId) ?? 0,
  }))
  const products = [...productMap.values()]
    .map((product) => ({
      employeeCount: product.employeeCount,
      name: product.name,
      purchaseCount: product.purchaseCount,
      totalQuantity: product.totalQuantity,
      totalSpent: roundCurrency(product.totalSpent),
    }))
    .sort((left, right) => right.totalSpent - left.totalSpent)

  const categoryTotals = new Map<DashboardCategoryKey, number>()

  for (const receipt of filteredReceipts) {
    for (const item of receipt.items) {
      const category = normalizeDashboardCategory(item)
      categoryTotals.set(
        category,
        (categoryTotals.get(category) ?? 0) + item.totalPrice
      )
    }
  }

  const categories = DASHBOARD_CATEGORY_OPTIONS.map((option) => {
    const total = roundCurrency(categoryTotals.get(option.key) ?? 0)

    return {
      key: option.key,
      label: option.label,
      total,
      ratio: totalSpent > 0 ? total / totalSpent : 0,
    }
  })

  return {
    alerts,
    categories,
    employees: employeesWithAlerts,
    filteredReceipts,
    policyRows: buildPolicyRows(filteredReceipts, input.policyLimits),
    products,
    summary: {
      receiptsProcessed: filteredReceipts.length,
      totalSpent,
      uniqueEmployees,
      uniqueProducts,
    },
  }
}
