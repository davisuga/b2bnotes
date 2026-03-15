import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useTranslation } from "react-i18next"
import {
  Camera,
  Check,
  ImagePlus,
  Loader2,
  Plus,
  RefreshCcw,
  Sparkles,
  TriangleAlert,
  Upload,
  UserRound,
  X,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import type {AnalyzedReceiptDraft, EditableReceiptDraft} from "@/features/scan/types";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  createReceiptUploadUrl,
  getScanBootstrap,
  saveReceiptDraft,
  startReceiptParsing,
  streamReceiptParsingStatus,
} from "@/features/scan/server"
import {
  
  
  createEmptyReceiptDraft,
  createEmptyReceiptItem,
  toEditableReceiptDraft
} from "@/features/scan/types"
import {
  SUPPORTED_RECEIPT_MIME_TYPES,
  formatVendorTaxId,
  isValidBrazilCnpj,
  sumItemTotals,
  toErrorMessage,
} from "@/features/scan/utils"
import { preciseCurrencyFormatter } from "@/lib/i18n"

const bootstrapQueryKey = ["scan-bootstrap"]
const dashboardQueryKey = ["dashboard-bootstrap"]
const lastUserStorageKey = "scan:last-user-id"

type ScanStep =
  | "capture"
  | "preview"
  | "analyzing"
  | "review"
  | "error"
  | "saved"

type ScanErrorState = {
  allowManualEntry: boolean
  message: string
}

export const Route = createFileRoute("/scan")({
  component: ScanRoute,
})

function ScanRoute() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const bootstrapServerFn = useServerFn(getScanBootstrap)
  const createUploadUrlServerFn = useServerFn(createReceiptUploadUrl)
  const saveReceiptServerFn = useServerFn(saveReceiptDraft)
  const startReceiptParsingServerFn = useServerFn(startReceiptParsing)
  const streamReceiptParsingStatusServerFn = useServerFn(
    streamReceiptParsingStatus
  )

  const [step, setStep] = React.useState<ScanStep>("capture")
  const [selectedUserId, setSelectedUserId] = React.useState("")
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [uploadedObjectKey, setUploadedObjectKey] = React.useState<
    string | null
  >(null)
  const [draftReceiptId, setDraftReceiptId] = React.useState<string | null>(
    null
  )
  const [selectedFileName, setSelectedFileName] = React.useState("")
  const [draft, setDraft] = React.useState<EditableReceiptDraft>(
    createEmptyReceiptDraft
  )
  const [errorState, setErrorState] = React.useState<ScanErrorState | null>(
    null
  )

  const bootstrapQuery = useQuery({
    queryKey: bootstrapQueryKey,
    queryFn: () => bootstrapServerFn(),
  })

  React.useEffect(() => {
    if (!previewUrl) {
      return
    }

    return () => {
      URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  React.useEffect(() => {
    const users = bootstrapQuery.data?.users ?? []

    if (!users.length) {
      return
    }

    setSelectedUserId((currentValue) => {
      const hasCurrentUser = users.some((user) => user.id === currentValue)

      if (hasCurrentUser) {
        return currentValue
      }

      const storedUserId = window.localStorage.getItem(lastUserStorageKey)

      if (storedUserId && users.some((user) => user.id === storedUserId)) {
        return storedUserId
      }

      return users[0]?.id ?? ""
    })
  }, [bootstrapQuery.data?.users])

  React.useEffect(() => {
    if (!selectedUserId) {
      return
    }

    window.localStorage.setItem(lastUserStorageKey, selectedUserId)
  }, [selectedUserId])

  React.useEffect(() => {
    if (step !== "saved") {
      return
    }

    const timer = window.setTimeout(() => {
      clearCurrentReceipt()
    }, 1800)

    return () => {
      window.clearTimeout(timer)
    }
  }, [step])

  React.useEffect(() => {
    if (step !== "analyzing" || !draftReceiptId) {
      return
    }

    const abortController = new AbortController()
    const textDecoder = new TextDecoder()
    let buffer = ""
    let isCancelled = false

    async function streamParsingStatus() {
      const response = await streamReceiptParsingStatusServerFn({
        data: draftReceiptId,
        signal: abortController.signal,
      })

      if (!(response instanceof Response) || !response.body) {
        throw new Error(
          "Não foi possível acompanhar o processamento do recibo em tempo real."
        )
      }

      const reader = response.body.getReader()

      while (!isCancelled) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        buffer += textDecoder.decode(value, { stream: true })

        while (buffer.includes("\n")) {
          const lineBreakIndex = buffer.indexOf("\n")
          const line = buffer.slice(0, lineBreakIndex).trim()
          buffer = buffer.slice(lineBreakIndex + 1)

          if (!line) {
            continue
          }

          const event = JSON.parse(line) as {
            draft: AnalyzedReceiptDraft | null
            receiptId: string
            status: string
          }

          setDraftReceiptId(event.receiptId)

          if (event.status === "extracted" && event.draft) {
            setDraft(toEditableReceiptDraft(event.draft))
            setErrorState(null)
            setStep("review")
            return
          }

          if (event.status === "flagged") {
            setErrorState({
              allowManualEntry: true,
              message: t("scan.errorFallback"),
            })
            setStep("error")
            return
          }
        }
      }
    }

    void streamParsingStatus().catch((error) => {
      if (abortController.signal.aborted || isCancelled) {
        return
      }

      setErrorState({
        allowManualEntry: true,
        message: toErrorMessage(error, t("scan.errorFallback")),
      })
      setStep("error")
    })

    return () => {
      isCancelled = true
      abortController.abort()
    }
  }, [draftReceiptId, step, streamReceiptParsingStatusServerFn, t])

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!selectedUserId) {
        throw new Error("Selecione um funcionário antes de enviar um recibo.")
      }

      const contentType = file.type || "image/jpeg"
      const upload = await createUploadUrlServerFn({
        data: {
          contentType,
          fileName: file.name,
          userId: selectedUserId,
        },
      })

      const response = await fetch(upload.uploadUrl, {
        body: file,
        headers: {
          "Content-Type": upload.contentType,
        },
        method: "PUT",
      })

      if (!response.ok) {
        throw new Error("Não foi possível enviar a foto. Tente outra imagem.")
      }

      return upload
    },
    onSuccess: (result) => {
      setUploadedObjectKey(result.objectKey)
    },
    onError: (error) => {
      setErrorState({
        allowManualEntry: false,
        message:
          error instanceof TypeError && /Failed to fetch/i.test(error.message)
            ? t("scan.uploadCorsFallback")
            : toErrorMessage(error, t("scan.uploadErrorFallback")),
      })
      setStep("error")
    },
  })

  const startParsingMutation = useMutation({
    mutationFn: async () => {
      if (!selectedUserId) {
        throw new Error("Selecione um funcionário antes de extrair o recibo.")
      }

      if (!uploadedObjectKey) {
        throw new Error("Envie a imagem do recibo antes de iniciar a extração.")
      }

      return startReceiptParsingServerFn({
        data: {
          objectKey: uploadedObjectKey,
          receiptId: draftReceiptId ?? undefined,
          userId: selectedUserId,
        },
      })
    },
    onSuccess: (result) => {
      setDraftReceiptId(result.receiptId)
      setErrorState(null)
    },
    onError: (error) => {
      setErrorState({
        allowManualEntry: true,
        message: toErrorMessage(
          error,
          "Não foi possível extrair este recibo com segurança. Tente outra foto ou preencha os itens manualmente."
        ),
      })
      setStep("error")
    },
  })

  const saveMutation = useMutation({
    mutationFn: async () => {
      return saveReceiptServerFn({
        data: {
          items: draft.items,
          objectKey: uploadedObjectKey ?? undefined,
          receiptId: draftReceiptId ?? undefined,
          receiptDate: draft.receiptDate,
          totalAmount: draft.totalAmount,
          userId: selectedUserId,
          vendorName: draft.vendorName,
          vendorTaxId: draft.vendorTaxId,
        },
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bootstrapQueryKey })
      await queryClient.invalidateQueries({ queryKey: dashboardQueryKey })
      setStep("saved")
    },
    onError: (error) => {
      setErrorState({
        allowManualEntry: true,
        message: toErrorMessage(
          error,
          "Não foi possível salvar o recibo. Revise os campos e tente novamente."
        ),
      })
      setStep("error")
    },
  })

  const users = bootstrapQuery.data?.users ?? []
  const selectedUser = users.find((user) => user.id === selectedUserId)
  const isAnalyzeDisabled =
    !uploadedObjectKey ||
    uploadMutation.isPending ||
    startParsingMutation.isPending
  const canSave =
    Boolean(
      selectedUserId &&
      uploadedObjectKey &&
      draft.vendorName.trim() &&
      draft.items.length > 0 &&
      draft.items.every(
        (item) => item.name.trim() && item.quantity > 0 && item.unitPrice >= 0
      )
    ) && !saveMutation.isPending

  function clearCurrentReceipt() {
    setDraft(createEmptyReceiptDraft())
    setErrorState(null)
    setPreviewUrl(null)
    setSelectedFileName("")
    setStep("capture")
    setDraftReceiptId(null)
    setUploadedObjectKey(null)
  }

  function openFilePicker() {
    fileInputRef.current?.click()
  }

  function beginManualEntry() {
    setDraft(createEmptyReceiptDraft())
    setErrorState(null)
    setStep("review")
  }

  function updateDraftField<K extends keyof EditableReceiptDraft>(
    field: K,
    value: EditableReceiptDraft[K]
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }))
  }

  function updateItemField(
    itemId: string,
    field: "name" | "category" | "quantity" | "unitPrice",
    value: string | number
  ) {
    setDraft((currentDraft) => {
      const nextItems = currentDraft.items.map((item) => {
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
          [field]: String(value),
        }
      })

      return {
        ...currentDraft,
        items: nextItems,
      }
    })
  }

  function addItem() {
    setDraft((currentDraft) => ({
      ...currentDraft,
      items: [...currentDraft.items, createEmptyReceiptItem()],
    }))
  }

  function removeItem(itemId: string) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      items: currentDraft.items.filter((item) => item.id !== itemId),
      totalAmount:
        currentDraft.items.length === 1 ? 0 : currentDraft.totalAmount,
    }))
  }

  async function handleFileSelection(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const nextFile = event.target.files?.[0]

    if (!nextFile) {
      return
    }

    const nextPreviewUrl = URL.createObjectURL(nextFile)

    setDraft(createEmptyReceiptDraft())
    setErrorState(null)
    setPreviewUrl(nextPreviewUrl)
    setSelectedFileName(nextFile.name)
    setStep("preview")
    setUploadedObjectKey(null)
    uploadMutation.mutate(nextFile)
    event.target.value = ""
  }

  function handleAnalyze() {
    setErrorState(null)
    setStep("analyzing")
    startParsingMutation.mutate()
  }

  function handleSave() {
    setErrorState(null)
    saveMutation.mutate()
  }

  function handleRescan() {
    setErrorState(null)
    setStep("preview")
  }

  const itemSum = sumItemTotals(draft.items)

  if (bootstrapQuery.isPending) {
    return (
      <div className="flex min-h-[calc(100vh-120px)] items-center justify-center p-6">
        <div className="flex items-center gap-3 text-sm text-text-secondary">
          <Loader2 className="animate-spin" size={18} />
          {t("scan.loading")}
        </div>
      </div>
    )
  }

  if (bootstrapQuery.isError) {
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
                  bootstrapQuery.error,
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
      <input
        ref={fileInputRef}
        accept={SUPPORTED_RECEIPT_MIME_TYPES.join(",")}
        capture="environment"
        className="hidden"
        onChange={handleFileSelection}
        type="file"
      />

      <div className="mb-4 flex items-center gap-3 rounded-[24px] border border-border/60 bg-bg-surface px-4 py-3 shadow-soft">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-base">
          <UserRound size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <label className="block text-xs font-medium tracking-[0.12em] text-text-secondary uppercase">
            {t("scan.employee")}
          </label>
          <select
            className="mt-1 w-full bg-transparent text-sm font-medium outline-none"
            disabled={!users.length}
            onChange={(event) => setSelectedUserId(event.target.value)}
            value={selectedUserId}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!users.length ? (
        <Card className="p-6">
          <p className="text-sm text-text-secondary">{t("scan.noEmployees")}</p>
        </Card>
      ) : (
        <AnimatePresence mode="wait">
          {step === "capture" && (
            <motion.div
              key="capture"
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-1 flex-col justify-center gap-6"
              initial={{ opacity: 0, y: 18 }}
            >
              <div className="space-y-2 text-center">
                <h1 className="font-display text-4xl font-bold tracking-tight">
                  {t("scan.captureTitle")}
                </h1>
                <p className="text-base text-text-secondary">
                  {t("scan.captureDescription")}
                </p>
              </div>

              <button
                className="group relative flex aspect-[3/4] w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-[32px] border border-border/50 bg-bg-surface shadow-floating transition-transform hover:scale-[1.01]"
                onClick={openFilePicker}
                type="button"
              >
                <div className="absolute inset-4 rounded-[24px] border-2 border-dashed border-border transition-colors group-hover:border-accent/30" />
                <div className="flex h-18 w-18 items-center justify-center rounded-full bg-bg-base">
                  <Camera size={30} />
                </div>
                <div className="space-y-1 text-center">
                  <p className="font-display text-xl font-bold">
                    {t("scan.captureButton")}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {t("scan.captureHint")}
                  </p>
                </div>
              </button>
            </motion.div>
          )}

          {step === "preview" && (
            <motion.div
              key="preview"
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-1 flex-col gap-5"
              initial={{ opacity: 0, y: 16 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <div className="space-y-1 text-center">
                <h2 className="font-display text-3xl font-bold">
                  {t("scan.confirmPhotoTitle")}
                </h2>
                <p className="text-sm text-text-secondary">
                  {uploadMutation.isPending
                    ? t("scan.confirmPhotoUploading")
                    : t("scan.confirmPhotoReady")}
                </p>
              </div>

              <Card className="overflow-hidden">
                {previewUrl ? (
                  <img
                    alt="Pré-visualização do recibo"
                    className="aspect-[3/4] w-full bg-bg-base object-contain"
                    src={previewUrl}
                  />
                ) : (
                  <div className="flex aspect-[3/4] items-center justify-center bg-bg-base text-text-secondary">
                    {t("scan.noImageSelected")}
                  </div>
                )}
              </Card>

              <div className="rounded-[24px] border border-border/60 bg-bg-surface px-4 py-3 text-sm text-text-secondary shadow-soft">
                <p className="truncate font-medium text-text-primary">
                  {selectedFileName}
                </p>
                <p className="mt-1">
                  {uploadMutation.isPending
                    ? t("scan.uploadingNow")
                    : uploadedObjectKey
                      ? t("scan.storedAndReady")
                      : t("scan.waitingUpload")}
                </p>
              </div>

              <div className="mt-auto flex gap-3">
                <Button
                  className="flex-1"
                  onClick={openFilePicker}
                  type="button"
                  variant="secondary"
                >
                  <ImagePlus className="mr-2" size={18} />
                  {t("scan.chooseAnother")}
                </Button>
                <Button
                  className="flex-1"
                  disabled={isAnalyzeDisabled}
                  onClick={handleAnalyze}
                  type="button"
                >
                  {uploadMutation.isPending ||
                  startParsingMutation.isPending ? (
                    <Loader2 className="mr-2 animate-spin" size={18} />
                  ) : (
                    <Sparkles className="mr-2" size={18} />
                  )}
                  {t("scan.analyze")}
                </Button>
              </div>
            </motion.div>
          )}

          {step === "analyzing" && (
            <motion.div
              key="analyzing"
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-1 flex-col items-center justify-center gap-6"
              initial={{ opacity: 0, scale: 0.95 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bg-surface shadow-floating">
                <Loader2 className="animate-spin text-accent" size={30} />
              </div>
              <div className="space-y-2 text-center">
                <h2 className="font-display text-2xl font-bold">
                  {t("scan.analyzingTitle")}
                </h2>
                <p className="text-sm text-text-secondary">
                  {t("scan.analyzingDescription")}
                </p>
              </div>
            </motion.div>
          )}

          {step === "review" && (
            <motion.div
              key="review"
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-1 flex-col gap-4"
              initial={{ opacity: 0, y: 18 }}
              exit={{ opacity: 0, y: -18 }}
            >
              <div className="space-y-1 text-center">
                <h2 className="font-display text-3xl font-bold">
                  {t("scan.reviewTitle")}
                </h2>
                <p className="text-sm text-text-secondary">
                  {t("scan.reviewDescription")}
                </p>
              </div>

              {previewUrl ? (
                <Card className="overflow-hidden">
                  <img
                    alt="Pré-visualização do recibo enviado"
                    className="max-h-44 w-full bg-bg-base object-contain"
                    src={previewUrl}
                  />
                </Card>
              ) : null}

              <Card className="p-5">
                <div className="grid gap-4">
                  <label className="grid gap-1">
                    <span className="text-xs font-medium tracking-[0.12em] text-text-secondary uppercase">
                      {t("scan.supplier")}
                    </span>
                    <input
                      className="rounded-2xl border border-border bg-bg-base px-4 py-3 text-sm ring-accent transition outline-none focus:ring-2"
                      onChange={(event) =>
                        updateDraftField("vendorName", event.target.value)
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
                        updateDraftField("vendorTaxId", event.target.value)
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

                  <div className="grid grid-cols-2 gap-3">
                    <label className="grid gap-1">
                      <span className="text-xs font-medium tracking-[0.12em] text-text-secondary uppercase">
                        {t("scan.date")}
                      </span>
                      <input
                        className="rounded-2xl border border-border bg-bg-base px-4 py-3 text-sm ring-accent transition outline-none focus:ring-2"
                        onChange={(event) =>
                          updateDraftField("receiptDate", event.target.value)
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
                          updateDraftField(
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

              <Card className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold">
                      {t("scan.itemsTitle")}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {t("scan.itemsDescription")}
                    </p>
                  </div>
                  <Button
                    onClick={addItem}
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
                        className="rounded-[24px] border border-border/70 bg-bg-base p-4"
                      >
                        <div className="grid gap-3">
                          <div className="flex items-start gap-3">
                            <input
                              className="min-w-0 flex-1 rounded-xl border border-border bg-white px-3 py-2 text-sm ring-accent transition outline-none focus:ring-2"
                              onChange={(event) =>
                                updateItemField(
                                  item.id,
                                  "name",
                                  event.target.value
                                )
                              }
                              placeholder={t("scan.itemNamePlaceholder")}
                              type="text"
                              value={item.name}
                            />
                            <button
                              className="rounded-full p-2 text-text-secondary transition hover:bg-danger/10 hover:text-danger"
                              onClick={() => removeItem(item.id)}
                              type="button"
                            >
                              <X size={16} />
                            </button>
                          </div>

                          <input
                            className="rounded-xl border border-border bg-white px-3 py-2 text-sm ring-accent transition outline-none focus:ring-2"
                            onChange={(event) =>
                              updateItemField(
                                item.id,
                                "category",
                                event.target.value
                              )
                            }
                            placeholder={t("scan.categoryPlaceholder")}
                            type="text"
                            value={item.category}
                          />

                          <div className="grid grid-cols-3 gap-3">
                            <label className="grid gap-1">
                              <span className="text-xs font-medium tracking-[0.12em] text-text-secondary uppercase">
                                {t("scan.quantity")}
                              </span>
                              <input
                                className="rounded-xl border border-border bg-white px-3 py-2 text-sm ring-accent transition outline-none focus:ring-2"
                                onChange={(event) =>
                                  updateItemField(
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

                            <label className="grid gap-1">
                              <span className="text-xs font-medium tracking-[0.12em] text-text-secondary uppercase">
                                {t("scan.unitPrice")}
                              </span>
                              <input
                                className="rounded-xl border border-border bg-white px-3 py-2 text-sm ring-accent transition outline-none focus:ring-2"
                                onChange={(event) =>
                                  updateItemField(
                                    item.id,
                                    "unitPrice",
                                    Number(event.target.value || 0)
                                  )
                                }
                                step="0.01"
                                type="number"
                                value={item.unitPrice}
                              />
                            </label>

                            <div className="grid gap-1">
                              <span className="text-xs font-medium tracking-[0.12em] text-text-secondary uppercase">
                                {t("scan.lineTotal")}
                              </span>
                              <div className="rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold">
                                {preciseCurrencyFormatter.format(
                                  Number(item.quantity * item.unitPrice)
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

              <div className="mt-auto flex gap-3">
                <Button
                  className="flex-1"
                  onClick={handleRescan}
                  type="button"
                  variant="secondary"
                >
                  <RefreshCcw className="mr-2" size={18} />
                  {t("scan.rescan")}
                </Button>
                <Button
                  className="flex-1"
                  disabled={!canSave}
                  onClick={handleSave}
                  type="button"
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="mr-2 animate-spin" size={18} />
                  ) : (
                    <Check className="mr-2" size={18} />
                  )}
                  {t("scan.confirmAndSave")}
                </Button>
              </div>
            </motion.div>
          )}

          {step === "error" && (
            <motion.div
              key="error"
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-1 flex-col justify-center gap-5"
              initial={{ opacity: 0, y: 18 }}
              exit={{ opacity: 0, y: -18 }}
            >
              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
                    <TriangleAlert size={22} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-display text-2xl font-bold">
                      {t("scan.errorTitle")}
                    </h2>
                    <p className="text-sm text-text-secondary">
                      {errorState?.message ?? t("scan.errorFallback")}
                    </p>
                    {selectedFileName ? (
                      <p className="text-xs font-medium tracking-[0.12em] text-text-secondary uppercase">
                        {t("scan.currentFile")}: {selectedFileName}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Card>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={openFilePicker}
                  type="button"
                  variant="secondary"
                >
                  <Upload className="mr-2" size={18} />
                  {t("scan.tryAnotherPhoto")}
                </Button>
                {errorState?.allowManualEntry ? (
                  <Button onClick={beginManualEntry} type="button">
                    <Plus className="mr-2" size={18} />
                    {t("scan.enterManually")}
                  </Button>
                ) : null}
                {previewUrl && uploadedObjectKey ? (
                  <Button onClick={handleAnalyze} type="button" variant="ghost">
                    <Sparkles className="mr-2" size={18} />
                    {t("scan.retryExtraction")}
                  </Button>
                ) : null}
              </div>
            </motion.div>
          )}

          {step === "saved" && (
            <motion.div
              key="saved"
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-1 flex-col items-center justify-center gap-6"
              initial={{ opacity: 0, scale: 0.95 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-success text-white shadow-floating">
                <Check size={44} />
              </div>
              <div className="space-y-2 text-center">
                <h2 className="font-display text-3xl font-bold">
                  {t("scan.savedTitle")}
                </h2>
                <p className="text-sm text-text-secondary">
                  {selectedUser?.fullName
                    ? t("scan.savedFor", { name: selectedUser.fullName })
                    : t("scan.savedFallback")}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
