import * as React from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { Loader2, Plus, TriangleAlert, Upload } from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toErrorMessage } from "@/features/scan/utils"
import type { TypedDocumentString } from "@/graphql/graphql"
import { subscribeClient } from "@/graphql/subscribe-client"

type ProcessingState = "processing" | "flagged" | "error"

const ReceiptProcessingSubscription = `
  subscription ScanReceiptProcessing($id: Uuid!) {
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
  {
    receiptsById?: {
      id: string
      status?: string | null
    } | null
  },
  { id: string }
>

export const Route = createFileRoute("/scan/processando/$receiptId")({
  component: ScanProcessingRoute,
})

function ScanProcessingRoute() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { receiptId } = Route.useParams()
  const [state, setState] = React.useState<ProcessingState>("processing")
  const [errorMessage, setErrorMessage] = React.useState("")

  React.useEffect(() => {
    let cancelled = false
    let completed = false

    const unsubscribe = subscribeClient(
      ReceiptProcessingSubscription,
      { id: receiptId },
      {
        next: async (payload) => {
          if (cancelled) {
            return
          }

          if (payload.errors?.length) {
            setErrorMessage(
              payload.errors
                .map((error) => error.message)
                .filter(Boolean)
                .join("\n") || t("scan.errorFallback")
            )
            setState("error")
            return
          }

          const receipt = payload.data?.receiptsById

          if (!receipt) {
            setErrorMessage(t("scan.errorFallback"))
            setState("error")
            return
          }

          if (receipt.status === "extracted") {
            completed = true
            await navigate({
              params: {
                receiptId: receipt.id,
              },
              replace: true,
              to: "/scan/revisar/$receiptId",
            })
            return
          }

          if (receipt.status === "flagged") {
            completed = true
            setState("flagged")
          }
        },
        error: (error) => {
          if (cancelled) {
            return
          }

          setErrorMessage(toErrorMessage(error, t("scan.errorFallback")))
          setState("error")
        },
        complete: () => {
          if (cancelled || completed) {
            return
          }

          setErrorMessage(t("scan.errorFallback"))
          setState("error")
        },
      }
    )

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [navigate, receiptId, t])

  if (state === "processing") {
    return (
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="flex min-h-[calc(100vh-120px)] flex-col items-center justify-center gap-6 p-6"
        initial={{ opacity: 0, scale: 0.95 }}
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
    )
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-md flex-col justify-center gap-5 p-6">
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
              {state === "flagged" ? t("scan.errorFallback") : errorMessage}
            </p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-3">
        <Button
          onClick={() =>
            navigate({
              params: {
                receiptId,
              },
              to: "/scan/revisar/$receiptId",
            })
          }
          type="button"
        >
          <Plus className="mr-2" size={18} />
          {t("scan.enterManually")}
        </Button>
        <Button
          onClick={() =>
            navigate({
              to: "/scan",
            })
          }
          type="button"
          variant="secondary"
        >
          <Upload className="mr-2" size={18} />
          {t("scan.tryAnotherPhoto")}
        </Button>
      </div>
    </div>
  )
}
