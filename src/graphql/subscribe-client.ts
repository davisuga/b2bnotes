import { createClient, type Sink } from "graphql-ws"

import type { FormattedExecutionResult } from "graphql-ws"

import type { TypedDocumentString } from "./graphql"

function getBrowserGraphqlUrl() {
  const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL

  if (!graphqlUrl) {
    throw new Error(
      "VITE_GRAPHQL_URL está ausente. Defina essa variável para habilitar subscriptions no navegador."
    )
  }

  return graphqlUrl
}

function getBrowserGraphqlSubscriptionUrl() {
  const url = new URL(getBrowserGraphqlUrl())
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:"
  return url.toString()
}

function getBrowserGraphqlAuthHeaders() {
  const authToken = import.meta.env.VITE_GRAPHQL_AUTH_TOKEN

  if (!authToken) {
    return undefined
  }

  return {
    "x-hasura-ddn-token": authToken,
  }
}

export function subscribeClient<TResult, TVariables extends Record<string, unknown>>(
  query: TypedDocumentString<TResult, TVariables>,
  variables: TVariables,
  sink: Sink<FormattedExecutionResult<TResult, Record<string, never>>>
) {
  const client = createClient({
    url: getBrowserGraphqlSubscriptionUrl(),
    lazy: true,
    connectionParams: getBrowserGraphqlAuthHeaders()
      ? {
          headers: getBrowserGraphqlAuthHeaders(),
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
