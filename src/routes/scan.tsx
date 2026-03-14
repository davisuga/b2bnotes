import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { graphql } from "@/graphql"
import { execute } from "@/graphql/execute"

const ReceiptsQuery = graphql(`
  query Receipts {
    receipts {
      id
      vendorName
      user{
        fullName
      }
      receiptDate
    }
  }
`)
export const Route = createFileRoute('/scan')({
    component: RouteComponent,
})

function RouteComponent() {
    const { data } = useQuery({
        queryKey: ['receipts'],
        queryFn: () => execute(ReceiptsQuery),
    })
    return <div>Hello "/scan"! {JSON.stringify(data, null, 2)}</div>
}
