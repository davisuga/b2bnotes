import * as React from "react"
import { Link } from "@tanstack/react-router"
import {
  AlertTriangle,
  CalendarRange,
  Loader2,
  ReceiptText,
  ScanLine,
  ShieldAlert,
  X,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useTranslation } from "react-i18next"
import type { Column } from "@tanstack/react-table"

import type {
  DashboardAlert,
  DashboardEmployeeRow,
  DashboardPeriod,
  DashboardReceiptDetailResult,
} from "@/features/dashboard/server"
import { DASHBOARD_PERIODS } from "@/features/dashboard/model"
import { Card } from "@/components/ui/card"
import {
  currencyFormatter,
  dateFormatter,
  dateTimeFormatter,
  default as i18n,
  numberFormatter,
  preciseCurrencyFormatter,
} from "@/lib/i18n"
import { formatVendorTaxId } from "@/features/scan/utils"

export const categoryToneClasses = [
  "bg-[#04342C]",
  "bg-[#0F6E56]",
  "bg-[#1D9E75]",
  "bg-[#5DCAA5]",
  "bg-[#BDE8D8]",
] as const

export function DashboardLoadingState() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center p-6">
      <div className="flex items-center gap-3 text-sm text-text-secondary">
        <Loader2 className="animate-spin" size={18} />
        {t("dashboard.loading")}
      </div>
    </div>
  )
}

export function DashboardErrorState({ error }: { error: unknown }) {
  const { t } = useTranslation()

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
              {error instanceof Error
                ? error.message
                : t("dashboard.unavailableFallback")}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export function DashboardPageFrame({
  children,
  description,
  period,
  setPeriod,
  title,
}: {
  children: React.ReactNode
  description: string
  period: DashboardPeriod
  setPeriod: (period: DashboardPeriod) => void
  title: string
}) {
  const { t } = useTranslation()

  return (
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
                  {title}
                </h1>
                <p className="max-w-xl text-sm leading-6 text-text-secondary md:text-base">
                  {description}
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

      {children}
    </div>
  )
}

export function SummaryCard({
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

export function SectionCard({
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

export function EmptyState({
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

export function DashboardAlertsList({
  alerts,
  dismissedAlertIds,
  onDismiss,
}: {
  alerts: Array<DashboardAlert>
  dismissedAlertIds: Array<string>
  onDismiss: (alertId: string) => void
}) {
  const { t } = useTranslation()
  const visibleAlerts = alerts
    .filter((alert) => !dismissedAlertIds.includes(alert.id))
    .slice(0, 8)

  if (!visibleAlerts.length) {
    return <EmptyState message={t("dashboard.sections.alerts.empty")} />
  }

  return (
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
            onClick={() => onDismiss(alert.id)}
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}

export function ProductHighlights({
  products,
}: {
  products: Array<{
    employeeCount: number
    name: string
    purchaseCount: number
    totalSpent: number
  }>
}) {
  const { t } = useTranslation()

  if (!products.length) {
    return <EmptyState message={t("dashboard.sections.products.empty")} />
  }

  return (
    <div className="space-y-2">
      {products.slice(0, 10).map((product, index) => (
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
                {product.purchaseCount} {t("dashboard.labels.timesBought")}
              </span>
              <span>
                {product.employeeCount} {t("dashboard.labels.employees")}
              </span>
              <span>{currencyFormatter.format(product.totalSpent)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function CategoryBreakdown({
  categories,
  totalSpent,
}: {
  categories: Array<{
    key: string
    label: string
    ratio: number
    total: number
  }>
  totalSpent: number
}) {
  const { t } = useTranslation()

  if (totalSpent <= 0) {
    return <EmptyState message={t("dashboard.sections.categories.empty")} />
  }

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-full bg-bg-base">
        <div className="flex h-5 w-full">
          {categories.map((category, index) => (
            <div
              key={category.key}
              className={categoryToneClasses[index]}
              style={{ width: `${category.ratio * 100}%` }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {categories.map((category, index) => (
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
  )
}

export function NoReceiptsCta() {
  const { t } = useTranslation()

  return (
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
  )
}

export function EmployeeDrawer({
  employee,
  onClose,
  onSelectReceipt,
}: {
  employee: DashboardEmployeeRow | null
  onClose: () => void
  onSelectReceipt: (receiptId: string) => void
}) {
  const { t } = useTranslation()

  return (
    <AnimatePresence>
      {employee ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[60] bg-black/30"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClose}
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
                  {employee.userName}
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  {employee.receiptCount} {t("dashboard.labels.receiptCount")} ·{" "}
                  {currencyFormatter.format(employee.totalSpent)} ·{" "}
                  {employee.topCategory}
                </p>
              </div>
              <button
                className="rounded-full bg-bg-base p-3 text-text-secondary transition hover:text-text-primary"
                onClick={onClose}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 md:p-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <MiniStat
                  label={t("dashboard.table.receipts")}
                  value={numberFormatter.format(employee.receiptCount)}
                />
                <MiniStat
                  label={t("dashboard.table.total")}
                  value={currencyFormatter.format(employee.totalSpent)}
                />
                <MiniStat
                  label={t("dashboard.table.alerts")}
                  value={
                    employee.alertCount
                      ? numberFormatter.format(employee.alertCount)
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
                {employee.receipts.map((receipt) => (
                  <button
                    key={receipt.id}
                    className="flex w-full items-center justify-between rounded-[20px] border border-border/60 bg-bg-base/70 px-4 py-3 text-left transition hover:translate-y-[-1px] hover:bg-white hover:shadow-soft"
                    onClick={() => onSelectReceipt(receipt.id)}
                    type="button"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {receipt.vendorName}
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">
                        {formatDate(receipt.receiptDate)} · {receipt.itemCount}{" "}
                        {t("dashboard.labels.items")} ·{" "}
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
    </AnimatePresence>
  )
}

export function ReceiptDetailModal({
  onClose,
  query,
  receiptId,
  selectedReceiptMeta,
}: {
  onClose: () => void
  query: {
    data?: DashboardReceiptDetailResult
    error: unknown
    isError: boolean
    isPending: boolean
  }
  receiptId: string | null
  selectedReceiptMeta: {
    receiptDate: string
    totalAmount: number
    userName: string
    vendorName: string
  } | null
}) {
  const { t } = useTranslation()

  return (
    <AnimatePresence>
      {receiptId ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[70] flex items-end bg-black/40 p-3 md:items-center md:justify-center md:p-6"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[32px] border border-border/60 bg-bg-surface shadow-floating"
            exit={{ opacity: 0, scale: 0.98, y: 20 }}
            initial={{ opacity: 0, scale: 0.98, y: 24 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border/60 px-5 py-4 md:px-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.12em] text-text-secondary uppercase">
                  {t("dashboard.labels.receiptDetail")}
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold">
                  {selectedReceiptMeta?.vendorName ??
                    t("dashboard.labels.selectedReceipt")}
                </h2>
                {selectedReceiptMeta ? (
                  <p className="mt-1 text-sm text-text-secondary">
                    {formatDate(selectedReceiptMeta.receiptDate)} ·{" "}
                    {selectedReceiptMeta.userName} ·{" "}
                    {currencyFormatter.format(selectedReceiptMeta.totalAmount)}
                  </p>
                ) : null}
              </div>
              <button
                className="rounded-full bg-bg-base p-3 text-text-secondary transition hover:text-text-primary"
                onClick={onClose}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            {query.isPending ? (
              <div className="flex min-h-[320px] items-center justify-center p-6">
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Loader2 className="animate-spin" size={18} />
                  {t("dashboard.labels.loadingReceiptDetail")}
                </div>
              </div>
            ) : query.isError ? (
              <div className="p-6">
                <Card className="p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-1 text-danger" size={18} />
                    <div>
                      <p className="font-display text-lg font-bold">
                        {t("dashboard.labels.receiptDetailUnavailable")}
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">
                        {query.error instanceof Error
                          ? query.error.message
                          : t(
                              "dashboard.labels.receiptDetailUnavailableFallback"
                            )}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ) : query.data ? (
              <div className="grid gap-0 md:grid-cols-2">
                <div className="border-b border-border/60 bg-bg-base md:border-r md:border-b-0">
                  {query.data.signedImageUrl ? (
                    <img
                      alt={t("dashboard.labels.receiptImageAlt", {
                        vendorName: query.data.receipt.vendorName,
                      })}
                      className="h-full px-4 max-h-[70vh] w-full object-contain"
                      src={query.data.signedImageUrl}
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
                      value={query.data.receipt.vendorName}
                    />
                    <MiniStat
                      label={t("dashboard.labels.employee")}
                      value={query.data.receipt.userName}
                    />
                    <MiniStat
                      label={t("dashboard.labels.receiptDate")}
                      value={formatDate(query.data.receipt.receiptDate)}
                    />
                    <MiniStat
                      label={t("dashboard.labels.total")}
                      value={preciseCurrencyFormatter.format(
                        query.data.receipt.totalAmount
                      )}
                    />
                    <MiniStat
                      label={t("dashboard.labels.vendorTaxId")}
                      value={formatVendorTaxDisplay(
                        query.data.receipt.vendorTaxId,
                        query.data.receipt.vendorTaxIdValid
                      )}
                    />
                    <MiniStat
                      label={t("dashboard.labels.status")}
                      value={formatReceiptStatus(query.data.receipt.status, t)}
                    />
                  </div>

                  <div className="mt-5 space-y-2">
                    {query.data.receipt.items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-[24px] border border-border/60 bg-bg-base/70 px-4 py-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold">{item.description}</p>
                            <p className="mt-1 text-sm text-text-secondary">
                              {item.category || t("dashboard.labels.other")} ·{" "}
                              {t("dashboard.labels.quantity")}{" "}
                              {trimNumber(item.quantity)} ·{" "}
                              {preciseCurrencyFormatter.format(item.unitPrice)}{" "}
                              {t("dashboard.labels.each")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-display font-bold">
                              {preciseCurrencyFormatter.format(item.totalPrice)}
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
  )
}

export function TablePagination({
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
        {t("dashboard.table.resultSummary", { count: currentCount })}
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

export function SortableHeader({
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

export function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-border/60 bg-bg-base/70 px-4 py-4">
      <p className="text-xs font-semibold tracking-[0.12em] text-text-secondary uppercase">
        {label}
      </p>
      <p className="mt-2 font-display text-lg font-bold">{value}</p>
    </div>
  )
}

export function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00`))
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return "—"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "—"
  }

  return dateTimeFormatter.format(date)
}

export function formatReceiptCode(value: string) {
  return value.slice(0, 8).toUpperCase()
}

export function trimNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2)
}

export function formatVendorTaxDisplay(
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

export function formatReceiptStatus(
  status: string | null,
  t: (key: string, options?: Record<string, unknown>) => string
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
