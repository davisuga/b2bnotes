import { createClient, type FormattedExecutionResult, type Sink } from "graphql-ws"
import WebSocket from "ws"

import { getGraphqlAuthHeaders } from "./auth"
import type { TypedDocumentString } from "./graphql"

function getGraphqlSubscriptionUrl() {
  const graphqlUrl = process.env.GRAPHQL_URL

  if (!graphqlUrl) {
    throw new Error(
      "GRAPHQL_URL está ausente. Defina essa variável antes de abrir subscriptions GraphQL."
    )
  }

  const url = new URL(graphqlUrl)
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:"
  return url.toString()
}

export function subscribe<TResult, TVariables extends Record<string, unknown>>(
  query: TypedDocumentString<TResult, TVariables>,
  variables: TVariables,
  sink: Sink<FormattedExecutionResult<TResult, Record<string, never>>>
) {
  const client = createClient({
    url: getGraphqlSubscriptionUrl(),
    webSocketImpl: WebSocket,
    lazy: true,
    connectionParams: Object.keys(getGraphqlAuthHeaders()).length
      ? {
          headers: getGraphqlAuthHeaders(),
        }
      : undefined,
  })

  return client.subscribe(
    {
      query: String(query),
      variables,
    },
    sink
  )
}
