import { getGraphqlAuthHeaders } from "./auth"
import type { TypedDocumentString } from "./graphql"

export async function execute<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  const graphqlUrl = process.env.GRAPHQL_URL

  if (!graphqlUrl) {
    throw new Error(
      "GRAPHQL_URL está ausente. Defina essa variável antes de chamar o GraphQL."
    )
  }

  const headers: Record<string, string> = {
    Accept: "application/graphql-response+json",
    "Content-Type": "application/json",
  }

  Object.assign(headers, getGraphqlAuthHeaders())

  const response = await fetch(graphqlUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  if (!response.ok) {
    console.error(response)
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
