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
  const headers: Record<string, string> = {}

  if (!authToken) {
    return headers
  }

  headers["x-hasura-ddn-token"] = authToken

  return headers
}

export async function executeClient<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  const response = await fetch(getBrowserGraphqlUrl(), {
    method: "POST",
    headers: {
      Accept: "application/graphql-response+json",
      "Content-Type": "application/json",
      ...getBrowserGraphqlAuthHeaders(),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  if (!response.ok) {
    throw new Error("A resposta de rede não foi bem-sucedida.")
  }

  const payload = (await response.json()) as {
    data?: TResult
    errors?: Array<{ message?: string }>
  }

  if (payload.errors?.length) {
    throw new Error(
      payload.errors
        .map((error) => error.message)
        .filter(Boolean)
        .join("\n") || "O GraphQL retornou um erro desconhecido."
    )
  }

  if (!payload.data) {
    throw new Error("A resposta do GraphQL não incluiu dados.")
  }

  return payload.data
}

export function subscribeClient<TResult, TVariables extends Record<string, unknown>>(
  query: TypedDocumentString<TResult, TVariables>,
  variables: TVariables,
  sink: Sink<FormattedExecutionResult<TResult, Record<string, never>>>
) {
  const client = createClient({
    url: getBrowserGraphqlSubscriptionUrl(),
    lazy: true,
    connectionParams: Object.keys(getBrowserGraphqlAuthHeaders()).length
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
