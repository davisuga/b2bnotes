export function getGraphqlAuthHeaders() {
  const authToken = process.env.GRAPHQL_AUTH_TOKEN

  const headers: Record<string, string> = {}

  if (authToken) {
    headers["x-hasura-ddn-token"] = authToken
  }

  return headers
}
