import { Check, Loader2, Plus, RefreshCcw, Sparkles, X } from "lucide-react"
import { useTranslation } from "react-i18next"

import type { EditableReceiptDraft } from "@/features/scan/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  calculateItemTotal,
  formatVendorTaxId,
  isValidBrazilCnpj,
} from "@/features/scan/utils"
import { preciseCurrencyFormatter } from "@/lib/i18n"

export function ScanReviewEditor({
  canRetryExtraction = false,
  canSave,
  draft,
  imageUrl,
  isRetrying = false,
  isSaving = false,
  onAddItem,
  onItemChange,
  onRemoveItem,
  onRescan,
  onRetryExtraction,
  onSave,
  onUpdateDraftField,
}: {
  canRetryExtraction?: boolean
  canSave: boolean
  draft: EditableReceiptDraft
  imageUrl?: string | null
  isRetrying?: boolean
  isSaving?: boolean
  onAddItem: () => void
  onItemChange: (
    itemId: string,
    field: "name" | "category" | "quantity" | "unitPrice",
    value: string | number
  ) => void
  onRemoveItem: (itemId: string) => void
  onRescan: () => void
  onRetryExtraction?: () => void
  onSave: () => void
  onUpdateDraftField: <K extends keyof EditableReceiptDraft>(
    field: K,
    value: EditableReceiptDraft[K]
  ) => void
}) {
  const { t } = useTranslation()
  const itemSum = draft.items.reduce(
    (sum, item) => sum + calculateItemTotal(item.quantity, item.unitPrice),
    0
  )

  return (
    <div className="flex flex-1 flex-col gap-4 lg:gap-6">
      <div className="max-w-2xl space-y-1 text-center lg:text-left">
        <h2 className="font-display text-3xl font-bold">
          {t("scan.reviewTitle")}
        </h2>
        <p className="text-sm text-text-secondary">
          {t("scan.reviewDescription")}
        </p>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-6">
        <div className="order-2 flex flex-col gap-4 lg:sticky lg:top-6 lg:order-1">
          {imageUrl ? (
            <Card className="overflow-hidden">
              <img
                alt="Pré-visualização do recibo enviado"
                className="max-h-72 w-full bg-bg-base object-contain"
                src={imageUrl}
              />
            </Card>
          ) : null}

          <Card className="p-5">
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-xs font-medium tracking-[0.12em] text-text-secondary uppercase">
                  {t("scan.itemSum")}
                </p>
                <p className="font-display text-3xl font-bold">
                  {preciseCurrencyFormatter.format(itemSum)}
                </p>
              </div>
              <p className="text-sm text-text-secondary">
                {draft.items.length} {t("scan.itemsTitle").toLowerCase()}
              </p>
            </div>
          </Card>

          <Card className="border-border/70 p-4">
            <div className="grid gap-3">
              <Button
                className="h-auto min-h-12 justify-center px-5 py-3 text-center leading-tight whitespace-normal"
                disabled={!canSave}
                onClick={onSave}
                type="button"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 animate-spin" size={18} />
                ) : (
                  <Check className="mr-2" size={18} />
                )}
                {t("scan.confirmAndSave")}
              </Button>

              {onRetryExtraction ? (
                <Button
                  className="h-auto min-h-12 justify-center px-5 py-3 text-center leading-tight whitespace-normal"
                  disabled={!canRetryExtraction || isRetrying}
                  onClick={onRetryExtraction}
                  type="button"
                  variant="outline"
                >
                  {isRetrying ? (
                    <Loader2 className="mr-2 animate-spin" size={18} />
                  ) : (
                    <Sparkles className="mr-2" size={18} />
                  )}
                  {t("scan.retryExtraction")}
                </Button>
              ) : null}

              <Button
                className="h-auto min-h-12 justify-center px-5 py-3 text-center leading-tight whitespace-normal"
                onClick={onRescan}
                type="button"
                variant="secondary"
              >
                <RefreshCcw className="mr-2" size={18} />
                {t("scan.rescan")}
              </Button>
            </div>
          </Card>
        </div>

        <div className="order-1 flex flex-col gap-4 lg:order-2">
          <Card className="p-5 md:p-6">
            <div className="grid gap-4">
              <label className="grid gap-1">
                <span className="text-xs font-medium tracking-[0.12em] text-text-secondary uppercase">
                  {t("scan.supplier")}
                </span>
                <input
                  className="rounded-2xl border border-border bg-bg-base px-4 py-3 text-sm ring-accent transition outline-none focus:ring-2"
                  onChange={(event) =>
                    onUpdateDraftField("vendorName", event.target.value)
                  }
                  placeholder={t("scan.supplierPlaceholder")}
                  type="text"
                  value={draft.vendorName}
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-medium tracking-[0.12em] text-text-secondary uppercase">
                  {t("scan.vendorTaxId")}
                </span>
                <input
                  className="rounded-2xl border border-border bg-bg-base px-4 py-3 text-sm ring-accent transition outline-none focus:ring-2"
                  onChange={(event) =>
                    onUpdateDraftField("vendorTaxId", event.target.value)
                  }
                  placeholder={t("scan.vendorTaxIdPlaceholder")}
                  type="text"
                  value={formatVendorTaxId(draft.vendorTaxId)}
                />
                {draft.vendorTaxId.trim() ? (
                  <span className="text-xs text-text-secondary">
                    {isValidBrazilCnpj(draft.vendorTaxId)
                      ? t("scan.validCnpj")
                      : t("scan.invalidCnpj")}
                  </span>
                ) : (
                  <span className="text-xs text-text-secondary">
                    {t("scan.missingCnpjAlert")}
                  </span>
                )}
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className="text-xs font-medium tracking-[0.12em] text-text-secondary uppercase">
                    {t("scan.date")}
                  </span>
                  <input
                    className="rounded-2xl border border-border bg-bg-base px-4 py-3 text-sm ring-accent transition outline-none focus:ring-2"
                    onChange={(event) =>
                      onUpdateDraftField("receiptDate", event.target.value)
                    }
                    type="date"
                    value={draft.receiptDate}
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-medium tracking-[0.12em] text-text-secondary uppercase">
                    {t("scan.total")}
                  </span>
                  <input
                    className="rounded-2xl border border-border bg-bg-base px-4 py-3 text-right text-sm ring-accent transition outline-none focus:ring-2"
                    onChange={(event) =>
                      onUpdateDraftField(
                        "totalAmount",
                        Number(event.target.value || 0)
                      )
                    }
                    step="0.01"
                    type="number"
                    value={draft.totalAmount}
                  />
                </label>
              </div>
            </div>
          </Card>

          <Card className="p-5 md:p-6">
            <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-display text-lg font-bold">
                  {t("scan.itemsTitle")}
                </h3>
                <p className="text-sm text-text-secondary">
                  {t("scan.itemsDescription")}
                </p>
              </div>
              <Button
                className="h-auto min-h-9 shrink-0 px-4 py-2 text-center leading-tight whitespace-normal"
                onClick={onAddItem}
                size="sm"
                type="button"
                variant="secondary"
              >
                <Plus className="mr-2" size={16} />
                {t("scan.addItem")}
              </Button>
            </div>

            <div className="space-y-4">
              {draft.items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border px-4 py-6 text-center text-sm text-text-secondary">
                  {t("scan.noItems")}
                </div>
              ) : (
                draft.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[24px] border border-border/70 bg-bg-base px-4 py-3.5"
                  >
                    <div className="grid gap-2.5">
                      <div className="flex items-start gap-3">
                        <input
                          className="min-w-0 flex-1 rounded-full border border-border bg-white px-4 py-3 text-base ring-accent transition outline-none focus:ring-2"
                          onChange={(event) =>
                            onItemChange(item.id, "name", event.target.value)
                          }
                          placeholder={t("scan.itemNamePlaceholder")}
                          type="text"
                          value={item.name}
                        />
                        <button
                          className="mt-1 rounded-full p-2 text-text-secondary transition hover:bg-danger/10 hover:text-danger"
                          onClick={() => onRemoveItem(item.id)}
                          type="button"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <input
                        className="rounded-full border border-border bg-white px-4 py-3 text-base ring-accent transition outline-none focus:ring-2"
                        onChange={(event) =>
                          onItemChange(item.id, "category", event.target.value)
                        }
                        placeholder={t("scan.categoryPlaceholder")}
                        type="text"
                        value={item.category}
                      />

                      <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                        <label className="grid min-w-0 gap-1">
                          <span className="text-[11px] font-medium tracking-[0.08em] text-text-secondary uppercase">
                            {t("scan.quantity")}
                          </span>
                          <input
                            className="w-full min-w-0 rounded-full border border-border bg-white px-4 py-3 text-base ring-accent transition outline-none focus:ring-2"
                            onChange={(event) =>
                              onItemChange(
                                item.id,
                                "quantity",
                                Number(event.target.value || 0)
                              )
                            }
                            step="0.01"
                            type="number"
                            value={item.quantity}
                          />
                        </label>

                        <label className="grid min-w-0 gap-1">
                          <span className="text-[11px] font-medium tracking-[0.08em] text-text-secondary uppercase">
                            {t("scan.unitPrice")}
                          </span>
                          <div className="relative min-w-0">
                            <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm font-semibold text-text-secondary">
                              R$
                            </span>
                            <input
                              className="w-full min-w-0 rounded-full border border-border bg-white py-3 pr-4 pl-12 text-base ring-accent transition outline-none focus:ring-2"
                              onChange={(event) =>
                                onItemChange(
                                  item.id,
                                  "unitPrice",
                                  Number(event.target.value || 0)
                                )
                              }
                              step="0.01"
                              type="number"
                              value={item.unitPrice}
                            />
                          </div>
                        </label>

                        <div className="grid min-w-0 gap-1 sm:col-span-2">
                          <span className="text-[11px] font-medium tracking-[0.08em] text-text-secondary uppercase">
                            {t("scan.lineTotal")}
                          </span>
                          <div className="rounded-full border border-border bg-white px-4 py-3 text-base font-semibold">
                            {preciseCurrencyFormatter.format(
                              calculateItemTotal(item.quantity, item.unitPrice)
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 rounded-[20px] bg-bg-inverse px-4 py-3 text-sm text-text-inverse">
              <div className="flex items-center justify-between">
                <span>{t("scan.itemSum")}</span>
                <span className="font-mono font-semibold">
                  {preciseCurrencyFormatter.format(itemSum)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
