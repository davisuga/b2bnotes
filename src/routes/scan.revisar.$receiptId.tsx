import * as React from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useTranslation } from "react-i18next"
import { Loader2, TriangleAlert } from "lucide-react"

import type { EditableReceiptDraft } from "@/features/scan/types"
import { Card } from "@/components/ui/card"
import { ScanReviewEditor } from "@/features/scan/review-editor"
import {
  getScanReceiptDraft,
  saveReceiptDraft,
  startReceiptParsing,
} from "@/features/scan/server"
import { createEmptyReceiptItem } from "@/features/scan/types"
import {
  normalizeReceiptCategory,
  sumItemTotals,
  toErrorMessage,
} from "@/features/scan/utils"

export const Route = createFileRoute("/scan/revisar/$receiptId")({
  component: ScanReviewRoute,
})

function ScanReviewRoute() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { receiptId } = Route.useParams()
  const getScanReceiptDraftServerFn = useServerFn(getScanReceiptDraft)
  const saveReceiptDraftServerFn = useServerFn(saveReceiptDraft)
  const startReceiptParsingServerFn = useServerFn(startReceiptParsing)

  const [draft, setDraft] = React.useState<EditableReceiptDraft | null>(null)
  const [initializedReceiptId, setInitializedReceiptId] = React.useState<
    string | null
  >(null)
  const [errorMessage, setErrorMessage] = React.useState("")

  const receiptQuery = useQuery({
    queryKey: ["scan-receipt-draft", receiptId],
    queryFn: () => getScanReceiptDraftServerFn({ data: receiptId }),
  })

  React.useEffect(() => {
    if (!receiptQuery.data || initializedReceiptId === receiptId) {
      return
    }

    setDraft({
      ...receiptQuery.data.draft,
      items: receiptQuery.data.draft.items.length
        ? receiptQuery.data.draft.items
        : [],
    })
    setInitializedReceiptId(receiptId)
  }, [initializedReceiptId, receiptId, receiptQuery.data])

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!receiptQuery.data || !draft) {
        throw new Error("Não foi possível carregar o recibo para salvar.")
      }

      return saveReceiptDraftServerFn({
        data: {
          items: draft.items,
          receiptId,
          receiptDate: draft.receiptDate,
          totalAmount: sumItemTotals(draft.items),
          userId: receiptQuery.data.receipt.userId,
          vendorName: draft.vendorName,
          vendorTaxId: draft.vendorTaxId,
        },
      })
    },
    onSuccess: () => {
      void Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: ["scan-bootstrap"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-bootstrap"] }),
      ])

      void navigate({ replace: true, to: "/scan" })
    },
    onError: (error) => {
      setErrorMessage(
        toErrorMessage(
          error,
          "Não foi possível salvar o recibo. Revise os campos e tente novamente."
        )
      )
    },
  })

  const retryMutation = useMutation({
    mutationFn: async () => {
      if (!receiptQuery.data?.objectKey) {
        throw new Error(
          "A imagem original do recibo não está disponível para reprocessar."
        )
      }

      return startReceiptParsingServerFn({
        data: {
          objectKey: receiptQuery.data.objectKey,
          receiptId,
          userId: receiptQuery.data.receipt.userId,
        },
      })
    },
    onSuccess: async (result) => {
      await navigate({
        params: {
          receiptId: result.receiptId,
        },
        replace: true,
        to: "/scan/processando/$receiptId",
      })
    },
    onError: (error) => {
      setErrorMessage(toErrorMessage(error, t("scan.errorFallback")))
    },
  })

  function updateDraftField<K extends keyof EditableReceiptDraft>(
    field: K,
    value: EditableReceiptDraft[K]
  ) {
    setDraft((currentDraft) =>
      currentDraft
        ? {
            ...currentDraft,
            [field]: value,
          }
        : currentDraft
    )
  }

  function updateItemField(
    itemId: string,
    field: "name" | "category" | "quantity" | "unitPrice",
    value: string | number
  ) {
    setDraft((currentDraft) => {
      if (!currentDraft) {
        return currentDraft
      }

      return {
        ...currentDraft,
        items: currentDraft.items.map((item) => {
          if (item.id !== itemId) {
            return item
          }

          if (field === "quantity" || field === "unitPrice") {
            return {
              ...item,
              [field]:
                typeof value === "number" && Number.isFinite(value) ? value : 0,
            }
          }

          return {
            ...item,
            [field]:
              field === "category"
                ? normalizeReceiptCategory(String(value))
                : String(value),
          }
        }),
      }
    })
  }

  function addItem() {
    setDraft((currentDraft) =>
      currentDraft
        ? {
            ...currentDraft,
            items: [...currentDraft.items, createEmptyReceiptItem()],
          }
        : currentDraft
    )
  }

  function removeItem(itemId: string) {
    setDraft((currentDraft) =>
      currentDraft
        ? {
            ...currentDraft,
            items: currentDraft.items.filter((item) => item.id !== itemId),
            totalAmount:
              currentDraft.items.length === 1 ? 0 : currentDraft.totalAmount,
          }
        : currentDraft
    )
  }

  const canSave =
    Boolean(
      draft &&
      draft.vendorName.trim() &&
      draft.items.length > 0 &&
      draft.items.every(
        (item) => item.name.trim() && item.quantity > 0 && item.unitPrice >= 0
      )
    ) && !saveMutation.isPending

  if (receiptQuery.isPending || !draft) {
    return (
      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center p-6">
        <div className="flex items-center gap-3 text-sm text-text-secondary">
          <Loader2 className="animate-spin" size={18} />
          {t("scan.loading")}
        </div>
      </div>
    )
  }

  if (receiptQuery.isError) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-md flex-col justify-center gap-4 p-6">
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-1 text-danger" size={20} />
            <div className="space-y-2">
              <h1 className="font-display text-xl font-bold">
                {t("scan.unavailableTitle")}
              </h1>
              <p className="text-sm text-text-secondary">
                {toErrorMessage(
                  receiptQuery.error,
                  t("scan.unavailableFallback")
                )}
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-md flex-col p-4">
      {errorMessage ? (
        <Card className="mb-4 p-5">
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-1 text-danger" size={18} />
            <p className="text-sm text-text-secondary">{errorMessage}</p>
          </div>
        </Card>
      ) : null}

      <ScanReviewEditor
        canRetryExtraction={Boolean(receiptQuery.data.objectKey)}
        canSave={canSave}
        draft={{
          ...draft,
          totalAmount: sumItemTotals(draft.items),
        }}
        imageUrl={receiptQuery.data.signedImageUrl}
        isRetrying={retryMutation.isPending}
        isSaving={saveMutation.isPending}
        onAddItem={addItem}
        onItemChange={updateItemField}
        onRemoveItem={removeItem}
        onRescan={() => navigate({ to: "/scan" })}
        onRetryExtraction={() => {
          setErrorMessage("")
          retryMutation.mutate()
        }}
        onSave={() => {
          setErrorMessage("")
          saveMutation.mutate()
        }}
        onUpdateDraftField={updateDraftField}
      />
    </div>
  )
}
