import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table"
import { Link, createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useTranslation } from "react-i18next"
import {
  AlertTriangle,
  CalendarRange,
  Loader2,
  Package,
  ReceiptText,
  Search,
  ScanLine,
  ShieldAlert,
  Users,
  X,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { Card } from "@/components/ui/card"
import {
  DASHBOARD_CATEGORY_OPTIONS,
  DASHBOARD_PERIODS,
  type DashboardPeriod,
} from "@/features/dashboard/model"
import {
  getDashboardSnapshot,
  getReceiptDetail,
} from "@/features/dashboard/server"
import {
  currencyFormatter,
  dateFormatter,
  default as i18n,
  numberFormatter,
  preciseCurrencyFormatter,
} from "@/lib/i18n"
import { formatVendorTaxId } from "@/features/scan/utils"

export const Route = createFileRoute("/")({
  component: DashboardRoute,
})

const dashboardQueryKey = ["dashboard-bootstrap"]

const categoryToneClasses = [
  "bg-[#1C1C1E]",
  "bg-[#505056]",
  "bg-[#7B7B83]",
  "bg-[#A9A9B0]",
  "bg-[#D8D8DD]",
] as const

function DashboardRoute() {
  const { t } = useTranslation()
  const dashboardServerFn = useServerFn(getDashboardSnapshot)
  const receiptDetailServerFn = useServerFn(getReceiptDetail)

  const [period, setPeriod] = React.useState<DashboardPeriod>("30d")
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState<
    string | null
  >(null)
  const [selectedReceiptId, setSelectedReceiptId] = React.useState<
    string | null
  >(null)
  const [dismissedAlertIds, setDismissedAlertIds] = React.useState<string[]>([])

  const dashboardQuery = useQuery({
    queryKey: [...dashboardQueryKey, period],
    queryFn: () => dashboardServerFn({ data: period }),
    refetchInterval: 5_000,
    refetchOnWindowFocus: true,
  })

  const receiptDetailQuery = useQuery({
    enabled: Boolean(selectedReceiptId),
    queryKey: ["receipt-detail", selectedReceiptId],
    queryFn: async () => {
      if (!selectedReceiptId) {
        throw new Error("Selecione um recibo antes de carregar os detalhes.")
      }

      return receiptDetailServerFn({
        data: selectedReceiptId,
      })
    },
  })

  const view = dashboardQuery.data ?? {
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

  const visibleAlerts = React.useMemo(
    () =>
      view.alerts
        .filter((alert) => !dismissedAlertIds.includes(alert.id))
        .slice(0, 8),
    [dismissedAlertIds, view.alerts]
  )

  const selectedReceipt =
    view.receipts.find((receipt) => receipt.id === selectedReceiptId) ?? null
  const selectedEmployee =
    view.employees.find((employee) => employee.userId === selectedEmployeeId) ??
    null

  React.useEffect(() => {
    if (!selectedEmployeeId) {
      return
    }

    const employeeStillVisible = view.employees.some(
      (employee) => employee.userId === selectedEmployeeId
    )

    if (!employeeStillVisible) {
      setSelectedEmployeeId(null)
    }
  }, [selectedEmployeeId, view.employees])

  if (dashboardQuery.isPending) {
    return (
      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center p-6">
        <div className="flex items-center gap-3 text-sm text-text-secondary">
          <Loader2 className="animate-spin" size={18} />
          {t("dashboard.loading")}
        </div>
      </div>
    )
  }

  if (dashboardQuery.isError) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-md flex-col justify-center gap-4 p-6">
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 text-danger" size={20} />
            <div className="space-y-2">
              <h1 className="font-display text-xl font-bold">
                {t("dashboard.unavailableTitle")}
              </h1>
              <p className="text-sm text-text-secondary">
                {dashboardQuery.error instanceof Error
                  ? dashboardQuery.error.message
                  : t("dashboard.unavailableFallback")}
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-6xl flex-col gap-5 p-4 md:p-6">
        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[32px] border border-border/60 bg-bg-surface shadow-floating"
          initial={{ opacity: 0, y: 18 }}
        >
          <div className="relative overflow-hidden px-5 py-6 md:px-7 md:py-7">
            <div className="absolute inset-x-0 top-0 h-28" />
            <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl space-y-2">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-bg-base px-3 py-2 text-xs font-semibold tracking-[0.12em] text-text-secondary uppercase">
                  <CalendarRange size={14} />
                  {t("dashboard.badge")}
                </div>
                <div className="space-y-2">
                  <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                    {t("dashboard.heroTitle")}
                  </h1>
                  <p className="max-w-xl text-sm leading-6 text-text-secondary md:text-base">
                    {t("dashboard.heroDescription")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {DASHBOARD_PERIODS.map((option) => (
                  <button
                    key={option.id}
                    className={[
                      "rounded-full border px-4 py-3 font-display text-sm font-semibold transition",
                      period === option.id
                        ? "border-accent bg-accent text-accent-fg shadow-soft"
                        : "border-border bg-bg-base text-text-primary hover:bg-border/70",
                    ].join(" ")}
                    onClick={() => setPeriod(option.id)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
          initial={{ opacity: 0, y: 18 }}
          transition={{ delay: 0.04 }}
        >
          <SummaryCard
            icon={<ReceiptText size={18} />}
            label={t("dashboard.summary.totalSpent")}
            value={currencyFormatter.format(view.summary.totalSpent)}
          />
          <SummaryCard
            icon={<ReceiptText size={18} />}
            label={t("dashboard.summary.receiptsProcessed")}
            value={numberFormatter.format(view.summary.receiptsProcessed)}
          />
          <SummaryCard
            icon={<Users size={18} />}
            label={t("dashboard.summary.employeesWhoSubmitted")}
            value={numberFormatter.format(view.summary.uniqueEmployees)}
          />
          <SummaryCard
            icon={<Package size={18} />}
            label={t("dashboard.summary.uniqueProducts")}
            value={numberFormatter.format(view.summary.uniqueProducts)}
          />
        </motion.section>

        <SectionCard
          description={t("dashboard.sections.employee.description")}
          title={t("dashboard.sections.employee.title")}
        >
          {view.employees.length ? (
            <EmployeeSpendTable
              employees={view.employees}
              onSelectEmployee={setSelectedEmployeeId}
            />
          ) : (
            <EmptyState
              cta={
                <Link className="text-sm font-semibold underline" to="/scan">
                  {t("dashboard.sections.employee.cta")}
                </Link>
              }
              message={t("dashboard.sections.employee.empty")}
            />
          )}
        </SectionCard>

        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <SectionCard
            description={t("dashboard.sections.products.description")}
            title={t("dashboard.sections.products.title")}
          >
            {view.products.length ? (
              <div className="space-y-2">
                {view.products.slice(0, 10).map((product, index) => (
                  <div
                    key={`${product.name}-${index}`}
                    className="flex items-center gap-3 rounded-[24px] border border-border/60 bg-bg-base/70 px-4 py-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-surface font-display text-sm font-bold shadow-soft">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-lg font-bold">
                        {product.name}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary">
                        <span>
                          {product.purchaseCount}{" "}
                          {t("dashboard.labels.timesBought")}
                        </span>
                        <span>
                          {product.employeeCount}{" "}
                          {t("dashboard.labels.employees")}
                        </span>
                        <span>
                          {currencyFormatter.format(product.totalSpent)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message={t("dashboard.sections.products.empty")} />
            )}
          </SectionCard>

          <SectionCard
            description={t("dashboard.sections.categories.description")}
            title={t("dashboard.sections.categories.title")}
          >
            {view.summary.totalSpent > 0 ? (
              <div className="space-y-5">
                <div className="overflow-hidden rounded-full bg-bg-base">
                  <div className="flex h-5 w-full">
                    {view.categories.map((category, index) => (
                      <div
                        key={category.key}
                        className={categoryToneClasses[index]}
                        style={{ width: `${category.ratio * 100}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {view.categories.map((category, index) => (
                    <div
                      key={category.key}
                      className="flex items-center justify-between rounded-[20px] border border-border/60 bg-bg-base/70 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-3.5 w-3.5 rounded-full ${categoryToneClasses[index]}`}
                        />
                        <span className="font-medium">{category.label}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {Math.round(category.ratio * 100)}%
                        </p>
                        <p className="text-sm text-text-secondary">
                          {currencyFormatter.format(category.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState message={t("dashboard.sections.categories.empty")} />
            )}
          </SectionCard>
        </div>

        <SectionCard
          description={t("dashboard.sections.alerts.description")}
          title={t("dashboard.sections.alerts.title")}
        >
          {visibleAlerts.length ? (
            <div className="space-y-2">
              {visibleAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 rounded-[24px] border border-border/60 bg-bg-base/70 px-4 py-4"
                >
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-surface shadow-soft">
                    <ShieldAlert size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold tracking-[0.12em] text-text-secondary uppercase">
                      {alert.metric}
                    </p>
                    <p className="mt-1 leading-6">{alert.text}</p>
                  </div>
                  <button
                    className="rounded-full p-2 text-text-secondary transition hover:bg-bg-surface hover:text-text-primary"
                    onClick={() =>
                      setDismissedAlertIds((currentValue) => [
                        ...currentValue,
                        alert.id,
                      ])
                    }
                    type="button"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message={t("dashboard.sections.alerts.empty")} />
          )}
        </SectionCard>

        <SectionCard
          description={t("dashboard.sections.history.description")}
          title={t("dashboard.sections.history.title")}
        >
          {view.receipts.length ? (
            <ReceiptHistoryTable
              onSelectReceipt={setSelectedReceiptId}
              receipts={view.receipts}
            />
          ) : (
            <EmptyState
              cta={
                <Link className="text-sm font-semibold underline" to="/scan">
                  {t("dashboard.sections.history.cta")}
                </Link>
              }
              message={t("dashboard.sections.history.empty")}
            />
          )}
        </SectionCard>

        {!view.receipts.length ? (
          <Card className="rounded-[28px] border border-dashed border-border/80 bg-bg-surface p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-bg-base shadow-soft">
              <ScanLine size={22} />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold">
              {t("dashboard.labels.noReceiptsTitle")}
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-text-secondary">
              {t("dashboard.labels.noReceiptsDescription")}
            </p>
            <div className="mt-5">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 font-display font-semibold text-accent-fg shadow-soft transition hover:opacity-90"
                to="/scan"
              >
                <ScanLine className="mr-2" size={18} />
                {t("dashboard.labels.openScanner")}
              </Link>
            </div>
          </Card>
        ) : null}
      </div>

      <AnimatePresence>
        {selectedEmployee ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[60] bg-black/30"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setSelectedEmployeeId(null)}
          >
            <motion.aside
              animate={{ x: 0 }}
              className="absolute top-0 right-0 flex h-full w-full max-w-xl flex-col border-l border-border/60 bg-bg-surface shadow-floating"
              exit={{ x: "100%" }}
              initial={{ x: "100%" }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-border/60 px-5 py-4 md:px-6">
                <div>
                  <p className="text-xs font-semibold tracking-[0.12em] text-text-secondary uppercase">
                    {t("dashboard.labels.employeeDetail")}
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-bold">
                    {selectedEmployee.userName}
                  </h2>
                  <p className="mt-1 text-sm text-text-secondary">
                    {selectedEmployee.receiptCount}{" "}
                    {t("dashboard.labels.receiptCount")} ·{" "}
                    {currencyFormatter.format(selectedEmployee.totalSpent)} ·{" "}
                    {selectedEmployee.topCategory}
                  </p>
                </div>
                <button
                  className="rounded-full bg-bg-base p-3 text-text-secondary transition hover:text-text-primary"
                  onClick={() => setSelectedEmployeeId(null)}
                  type="button"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 md:p-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  <MiniStat
                    label={t("dashboard.table.receipts")}
                    value={numberFormatter.format(
                      selectedEmployee.receiptCount
                    )}
                  />
                  <MiniStat
                    label={t("dashboard.table.total")}
                    value={currencyFormatter.format(
                      selectedEmployee.totalSpent
                    )}
                  />
                  <MiniStat
                    label={t("dashboard.table.alerts")}
                    value={
                      selectedEmployee.alertCount
                        ? numberFormatter.format(selectedEmployee.alertCount)
                        : t("dashboard.labels.noAlerts")
                    }
                  />
                </div>

                <div className="mt-5">
                  <h3 className="font-display text-lg font-bold">
                    {t("dashboard.labels.employeeReceipts")}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {t("dashboard.labels.employeeDrawerHint")}
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  {selectedEmployee.receipts.map((receipt) => (
                    <button
                      key={receipt.id}
                      className="flex w-full items-center justify-between rounded-[20px] border border-border/60 bg-bg-base/70 px-4 py-3 text-left transition hover:translate-y-[-1px] hover:bg-white hover:shadow-soft"
                      onClick={() => setSelectedReceiptId(receipt.id)}
                      type="button"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {receipt.vendorName}
                        </p>
                        <p className="mt-1 text-sm text-text-secondary">
                          {formatDate(receipt.receiptDate)} ·{" "}
                          {receipt.itemCount} {t("dashboard.labels.items")} ·{" "}
                          {receipt.primaryCategory}
                        </p>
                      </div>
                      <p className="shrink-0 font-display font-bold">
                        {currencyFormatter.format(receipt.totalAmount)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}

        {selectedReceiptId ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[70] flex items-end bg-black/40 p-3 md:items-center md:justify-center md:p-6"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setSelectedReceiptId(null)}
          >
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[32px] border border-border/60 bg-bg-surface shadow-floating"
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-border/60 px-5 py-4 md:px-6">
                <div>
                  <p className="text-xs font-semibold tracking-[0.12em] text-text-secondary uppercase">
                    {t("dashboard.labels.receiptDetail")}
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-bold">
                    {selectedReceipt?.vendorName ??
                      t("dashboard.labels.selectedReceipt")}
                  </h2>
                  {selectedReceipt ? (
                    <p className="mt-1 text-sm text-text-secondary">
                      {formatDate(selectedReceipt.receiptDate)} ·{" "}
                      {selectedReceipt.userName} ·{" "}
                      {currencyFormatter.format(selectedReceipt.totalAmount)}
                    </p>
                  ) : null}
                </div>
                <button
                  className="rounded-full bg-bg-base p-3 text-text-secondary transition hover:text-text-primary"
                  onClick={() => setSelectedReceiptId(null)}
                  type="button"
                >
                  <X size={18} />
                </button>
              </div>

              {receiptDetailQuery.isPending ? (
                <div className="flex min-h-[320px] items-center justify-center p-6">
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <Loader2 className="animate-spin" size={18} />
                    {t("dashboard.labels.loadingReceiptDetail")}
                  </div>
                </div>
              ) : receiptDetailQuery.isError ? (
                <div className="p-6">
                  <Card className="p-5">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-1 text-danger" size={18} />
                      <div>
                        <p className="font-display text-lg font-bold">
                          {t("dashboard.labels.receiptDetailUnavailable")}
                        </p>
                        <p className="mt-1 text-sm text-text-secondary">
                          {receiptDetailQuery.error instanceof Error
                            ? receiptDetailQuery.error.message
                            : t(
                                "dashboard.labels.receiptDetailUnavailableFallback"
                              )}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              ) : receiptDetailQuery.data ? (
                <div className="grid gap-0 md:grid-cols-2">
                  <div className="border-b border-border/60 bg-bg-base md:border-r md:border-b-0">
                    {receiptDetailQuery.data.signedImageUrl ? (
                      <img
                        alt={t("dashboard.labels.receiptImageAlt", {
                          vendorName:
                            receiptDetailQuery.data.receipt.vendorName,
                        })}
                        className="h-full max-h-[70vh] w-full object-contain"
                        src={receiptDetailQuery.data.signedImageUrl}
                      />
                    ) : (
                      <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 p-8 text-center text-text-secondary">
                        <ReceiptText size={28} />
                        <p className="max-w-xs text-sm leading-6">
                          {t("dashboard.labels.noSourceImage")}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="max-h-[70vh] overflow-y-auto p-5 md:p-6">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <MiniStat
                        label={t("dashboard.labels.supplier")}
                        value={receiptDetailQuery.data.receipt.vendorName}
                      />
                      <MiniStat
                        label={t("dashboard.labels.employee")}
                        value={receiptDetailQuery.data.receipt.userName}
                      />
                      <MiniStat
                        label={t("dashboard.labels.receiptDate")}
                        value={formatDate(
                          receiptDetailQuery.data.receipt.receiptDate
                        )}
                      />
                      <MiniStat
                        label={t("dashboard.labels.total")}
                        value={preciseCurrencyFormatter.format(
                          receiptDetailQuery.data.receipt.totalAmount
                        )}
                      />
                      <MiniStat
                        label={t("dashboard.labels.vendorTaxId")}
                        value={formatVendorTaxDisplay(
                          receiptDetailQuery.data.receipt.vendorTaxId,
                          receiptDetailQuery.data.receipt.vendorTaxIdValid
                        )}
                      />
                      <MiniStat
                        label={t("dashboard.labels.status")}
                        value={formatReceiptStatus(
                          receiptDetailQuery.data.receipt.status,
                          t
                        )}
                      />
                    </div>

                    <div className="mt-5 space-y-2">
                      {receiptDetailQuery.data.receipt.items.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-[24px] border border-border/60 bg-bg-base/70 px-4 py-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold">
                                {item.description}
                              </p>
                              <p className="mt-1 text-sm text-text-secondary">
                                {item.category || t("dashboard.labels.other")} ·{" "}
                                {t("dashboard.labels.quantity")}{" "}
                                {trimNumber(item.quantity)} ·{" "}
                                {preciseCurrencyFormatter.format(
                                  item.unitPrice
                                )}{" "}
                                {t("dashboard.labels.each")}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-display font-bold">
                                {preciseCurrencyFormatter.format(
                                  item.totalPrice
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <Card className="rounded-[28px] border border-border/60 p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-bg-base shadow-soft">
        {icon}
      </div>
      <p className="mt-5 text-sm font-semibold tracking-[0.12em] text-text-secondary uppercase">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-bold tracking-tight">
        {value}
      </p>
    </Card>
  )
}

function SectionCard({
  children,
  description,
  title,
}: {
  children: React.ReactNode
  description: string
  title: string
}) {
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 18 }}
    >
      <Card className="rounded-[32px] border border-border/60 p-5 md:p-6">
        <div className="mb-5 space-y-1">
          <h2 className="font-display text-2xl font-bold">{title}</h2>
          <p className="text-sm leading-6 text-text-secondary">{description}</p>
        </div>
        {children}
      </Card>
    </motion.section>
  )
}

type EmployeeSpendRow = {
  alertCount: number
  receiptCount: number
  topCategory: string
  totalSpent: number
  userId: string
  userName: string
}

function EmployeeSpendTable({
  employees,
  onSelectEmployee,
}: {
  employees: Array<{
    alertCount: number
    receiptCount: number
    topCategory: string
    totalSpent: number
    userId: string
    userName: string
  }>
  onSelectEmployee: (employeeId: string) => void
}) {
  const { t } = useTranslation()
  const [searchValue, setSearchValue] = React.useState("")
  const deferredSearchValue = React.useDeferredValue(searchValue)
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "totalSpent", desc: true },
  ])
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  })

  const rows = React.useMemo<EmployeeSpendRow[]>(
    () =>
      employees.map((employee) => ({
        alertCount: employee.alertCount,
        receiptCount: employee.receiptCount,
        topCategory: employee.topCategory,
        totalSpent: employee.totalSpent,
        userId: employee.userId,
        userName: employee.userName,
      })),
    [employees]
  )

  const columns = React.useMemo<ColumnDef<EmployeeSpendRow>[]>(
    () => [
      {
        accessorKey: "userName",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label={t("dashboard.table.employee")}
          />
        ),
        cell: ({ row }) => (
          <div className="min-w-[12rem]">
            <p className="font-display text-base font-bold text-text-primary">
              {row.original.userName}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "receiptCount",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label={t("dashboard.table.receipts")}
          />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-text-primary">
            {numberFormatter.format(row.original.receiptCount)}
          </span>
        ),
      },
      {
        accessorKey: "totalSpent",
        header: ({ column }) => (
          <SortableHeader column={column} label={t("dashboard.table.total")} />
        ),
        cell: ({ row }) => (
          <span className="font-display text-sm font-bold text-text-primary">
            {currencyFormatter.format(row.original.totalSpent)}
          </span>
        ),
      },
      {
        accessorKey: "topCategory",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label={t("dashboard.labels.topCategory")}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-flex rounded-full bg-bg-surface px-2.5 py-1 text-xs font-semibold text-text-secondary">
            {row.original.topCategory}
          </span>
        ),
      },
      {
        accessorKey: "alertCount",
        header: ({ column }) => (
          <div className="flex justify-end">
            <SortableHeader
              column={column}
              label={t("dashboard.table.alerts")}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <span
              className={[
                "inline-flex min-w-10 items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold",
                row.original.alertCount
                  ? "bg-danger/10 text-danger"
                  : "bg-bg-surface text-text-secondary",
              ].join(" ")}
            >
              {row.original.alertCount
                ? numberFormatter.format(row.original.alertCount)
                : t("dashboard.labels.noAlerts")}
            </span>
          </div>
        ),
      },
    ],
    [t]
  )

  const table = useReactTable({
    columns,
    data: rows,
    state: {
      globalFilter: deferredSearchValue,
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = String(filterValue).trim().toLowerCase()

      if (!query) {
        return true
      }

      return [row.original.userName, row.original.topCategory]
        .join(" ")
        .toLowerCase()
        .includes(query)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  React.useEffect(() => {
    table.setPageIndex(0)
  }, [deferredSearchValue, table])

  return (
    <div className="space-y-4">
      <label className="block max-w-md space-y-2">
        <span className="text-xs font-semibold tracking-[0.12em] text-text-secondary uppercase">
          {t("dashboard.table.searchLabel")}
        </span>
        <span className="relative block">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-text-secondary"
            size={16}
          />
          <input
            className="w-full rounded-full border border-border/70 bg-bg-base py-3 pr-4 pl-11 text-sm text-text-primary transition outline-none placeholder:text-text-secondary/70 focus:border-accent"
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder={t("dashboard.table.employeeSearchPlaceholder")}
            type="search"
            value={searchValue}
          />
        </span>
      </label>

      <div className="overflow-hidden rounded-[28px] border border-border/60 bg-bg-base/70">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-bg-surface/80">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border-b border-border/60 px-4 py-3 text-left first:pl-5 last:pr-5"
                      scope="col"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="cursor-pointer transition focus-within:bg-white/70 hover:bg-white/70"
                    onClick={() => onSelectEmployee(row.original.userId)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        onSelectEmployee(row.original.userId)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="border-b border-border/50 px-4 py-4 align-middle first:pl-5 last:pr-5"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-5 py-10 text-center text-sm text-text-secondary"
                    colSpan={columns.length}
                  >
                    {t("dashboard.table.noEmployeeResults")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TablePagination
        currentCount={table.getFilteredRowModel().rows.length}
        pageIndex={table.getState().pagination.pageIndex}
        pageCount={table.getPageCount()}
        onNext={() => table.nextPage()}
        onPrevious={() => table.previousPage()}
        canNextPage={table.getCanNextPage()}
        canPreviousPage={table.getCanPreviousPage()}
      />
    </div>
  )
}

type ReceiptHistoryRow = {
  amount: number
  categoryKey: string
  categoryLabel: string
  id: string
  itemCount: number
  receiptDate: string
  receiptCode: string
  userName: string
  vendorName: string
}

function ReceiptHistoryTable({
  onSelectReceipt,
  receipts,
}: {
  onSelectReceipt: (receiptId: string) => void
  receipts: Array<{
    id: string
    itemCount: number
    primaryCategory: string
    primaryCategoryKey: string
    receiptDate: string
    totalAmount: number
    userName: string
    vendorName: string
  }>
}) {
  const { t } = useTranslation()
  const [searchValue, setSearchValue] = React.useState("")
  const deferredSearchValue = React.useDeferredValue(searchValue)
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "receiptDate", desc: true },
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const rows = React.useMemo<ReceiptHistoryRow[]>(
    () =>
      receipts.map((receipt) => {
        return {
          amount: receipt.totalAmount,
          categoryKey: receipt.primaryCategoryKey,
          categoryLabel: receipt.primaryCategory,
          id: receipt.id,
          itemCount: receipt.itemCount,
          receiptCode: formatReceiptCode(receipt.id),
          receiptDate: receipt.receiptDate,
          userName: receipt.userName,
          vendorName: receipt.vendorName,
        }
      }),
    [receipts]
  )

  const columns = React.useMemo<ColumnDef<ReceiptHistoryRow>[]>(
    () => [
      {
        accessorKey: "receiptCode",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label={t("dashboard.table.receipt")}
          />
        ),
        cell: ({ row }) => (
          <div className="min-w-[8rem]">
            <p className="font-display text-sm font-bold tracking-[0.04em] text-text-primary uppercase">
              #{row.original.receiptCode}
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              {numberFormatter.format(row.original.itemCount)}{" "}
              {t("dashboard.labels.items")}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "receiptDate",
        header: ({ column }) => (
          <SortableHeader column={column} label={t("dashboard.table.date")} />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-text-primary">
            {formatDate(row.original.receiptDate)}
          </span>
        ),
      },
      {
        accessorKey: "userName",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label={t("dashboard.table.employee")}
          />
        ),
        cell: ({ row }) => (
          <span className="font-medium text-text-primary">
            {row.original.userName}
          </span>
        ),
      },
      {
        accessorKey: "vendorName",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label={t("dashboard.table.merchant")}
          />
        ),
        cell: ({ row }) => (
          <span className="font-medium text-text-primary">
            {row.original.vendorName}
          </span>
        ),
      },
      {
        accessorKey: "categoryLabel",
        id: "category",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label={t("dashboard.table.category")}
          />
        ),
        filterFn: (row, _columnId, value) =>
          !value || row.original.categoryKey === value,
        cell: ({ row }) => (
          <span className="inline-flex rounded-full bg-bg-surface px-2.5 py-1 text-xs font-semibold text-text-secondary">
            {row.original.categoryLabel}
          </span>
        ),
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <div className="flex justify-end">
            <SortableHeader
              column={column}
              label={t("dashboard.table.amount")}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <p className="font-display text-base font-bold text-text-primary">
              {currencyFormatter.format(row.original.amount)}
            </p>
            <p className="text-xs text-text-secondary">
              {t("dashboard.labels.tapForDetail")}
            </p>
          </div>
        ),
      },
    ],
    [t]
  )

  const table = useReactTable({
    columns,
    data: rows,
    state: {
      columnFilters,
      globalFilter: deferredSearchValue,
      pagination,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = String(filterValue).trim().toLowerCase()

      if (!query) {
        return true
      }

      return [
        row.original.id,
        row.original.receiptCode,
        row.original.receiptDate,
        formatDate(row.original.receiptDate),
        row.original.userName,
        row.original.vendorName,
        row.original.categoryLabel,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const categoryFilterValue =
    (table.getColumn("category")?.getFilterValue() as string | undefined) ?? ""

  React.useEffect(() => {
    table.setPageIndex(0)
  }, [categoryFilterValue, deferredSearchValue, table])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px] lg:w-full lg:max-w-3xl">
          <label className="space-y-2">
            <span className="text-xs font-semibold tracking-[0.12em] text-text-secondary uppercase">
              {t("dashboard.table.searchLabel")}
            </span>
            <span className="relative block">
              <Search
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-text-secondary"
                size={16}
              />
              <input
                className="w-full rounded-full border border-border/70 bg-bg-base py-3 pr-4 pl-11 text-sm text-text-primary transition outline-none placeholder:text-text-secondary/70 focus:border-accent"
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder={t("dashboard.table.searchPlaceholder")}
                type="search"
                value={searchValue}
              />
            </span>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-semibold tracking-[0.12em] text-text-secondary uppercase">
              {t("dashboard.table.categoryFilter")}
            </span>
            <select
              className="w-full rounded-full border border-border/70 bg-bg-base px-4 py-3 text-sm text-text-primary transition outline-none focus:border-accent"
              onChange={(event) =>
                table
                  .getColumn("category")
                  ?.setFilterValue(event.target.value || undefined)
              }
              value={categoryFilterValue}
            >
              <option value="">{t("dashboard.table.allCategories")}</option>
              {DASHBOARD_CATEGORY_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="text-sm text-text-secondary">
          {numberFormatter.format(table.getFilteredRowModel().rows.length)}{" "}
          {t("dashboard.labels.receiptCount")}
        </p>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-border/60 bg-bg-base/70">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-bg-surface/80">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border-b border-border/60 px-4 py-3 text-left first:pl-5 last:pr-5"
                      scope="col"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="cursor-pointer transition focus-within:bg-white/70 hover:bg-white/70"
                    onClick={() => onSelectReceipt(row.original.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        onSelectReceipt(row.original.id)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="border-b border-border/50 px-4 py-4 align-middle first:pl-5 last:pr-5"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-5 py-10 text-center text-sm text-text-secondary"
                    colSpan={columns.length}
                  >
                    {t("dashboard.table.noResults")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TablePagination
        currentCount={table.getFilteredRowModel().rows.length}
        pageIndex={table.getState().pagination.pageIndex}
        pageCount={table.getPageCount()}
        onNext={() => table.nextPage()}
        onPrevious={() => table.previousPage()}
        canNextPage={table.getCanNextPage()}
        canPreviousPage={table.getCanPreviousPage()}
      />
    </div>
  )
}

function TablePagination({
  canNextPage,
  canPreviousPage,
  currentCount,
  onNext,
  onPrevious,
  pageCount,
  pageIndex,
}: {
  canNextPage: boolean
  canPreviousPage: boolean
  currentCount: number
  onNext: () => void
  onPrevious: () => void
  pageCount: number
  pageIndex: number
}) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-3 rounded-[24px] border border-border/60 bg-bg-base/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-text-secondary">
        {t("dashboard.table.resultSummary", {
          count: currentCount,
        })}
      </p>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          className="rounded-full border border-border bg-bg-surface px-4 py-2 text-sm font-semibold text-text-primary transition disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canPreviousPage}
          onClick={onPrevious}
          type="button"
        >
          {t("dashboard.table.previousPage")}
        </button>
        <span className="min-w-28 text-center text-sm text-text-secondary">
          {t("dashboard.table.pageSummary", {
            page: pageIndex + 1,
            total: Math.max(pageCount, 1),
          })}
        </span>
        <button
          className="rounded-full border border-border bg-bg-surface px-4 py-2 text-sm font-semibold text-text-primary transition disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canNextPage}
          onClick={onNext}
          type="button"
        >
          {t("dashboard.table.nextPage")}
        </button>
      </div>
    </div>
  )
}

function SortableHeader({
  column,
  label,
}: {
  column: Column<any, unknown>
  label: string
}) {
  const sortDirection = column.getIsSorted()

  return (
    <button
      className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-text-secondary uppercase transition hover:text-text-primary"
      onClick={column.getToggleSortingHandler()}
      type="button"
    >
      {label}
      <span className="text-[11px] text-text-secondary">
        {sortDirection === "asc" ? "↑" : sortDirection === "desc" ? "↓" : "↕"}
      </span>
    </button>
  )
}

function EmptyState({
  cta,
  message,
}: {
  cta?: React.ReactNode
  message: string
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-border/80 px-5 py-8 text-center">
      <p className="text-sm text-text-secondary">{message}</p>
      {cta ? <div className="mt-3">{cta}</div> : null}
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-border/60 bg-bg-base/70 px-4 py-4">
      <p className="text-xs font-semibold tracking-[0.12em] text-text-secondary uppercase">
        {label}
      </p>
      <p className="mt-2 font-display text-lg font-bold">{value}</p>
    </div>
  )
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00`))
}

function formatReceiptCode(value: string) {
  return value.slice(0, 8).toUpperCase()
}

function trimNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2)
}

function formatVendorTaxDisplay(
  vendorTaxId: string,
  vendorTaxIdValid: boolean
) {
  if (!vendorTaxId) {
    return i18n.t("dashboard.labels.missing")
  }

  if (vendorTaxIdValid) {
    return formatVendorTaxId(vendorTaxId)
  }

  return `${formatVendorTaxId(vendorTaxId)} (inválido)`
}

function formatReceiptStatus(
  status: string | null,
  t: (key: string) => string
) {
  switch (status) {
    case "processing":
      return t("dashboard.statuses.processing")
    case "approved":
      return t("dashboard.statuses.approved")
    case "flagged":
      return t("dashboard.statuses.flagged")
    case "extracted":
      return t("dashboard.statuses.extracted")
    default:
      return t("dashboard.statuses.unknown")
  }
}
