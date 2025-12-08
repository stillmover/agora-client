import { env } from "@/shared/utils/env";
import { logger } from "@/shared/services/logger";

type GraphQLError = {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: Array<string | number>;
  extensions?: Record<string, unknown>;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLError[];
};

export class GraphQLClientError extends Error {
  public readonly errors: GraphQLError[];
  public readonly status: number;

  constructor(errors: GraphQLError[], status = 400) {
    const message = errors.map((e) => e.message).join(", ");
    super(message);
    this.name = "GraphQLClientError";
    this.errors = errors;
    this.status = status;
  }
}

export async function graphqlRequest<TData, TVariables extends Record<string, unknown> = Record<string, unknown>>(
  document: string,
  variables?: TVariables,
): Promise<TData> {
  const response = await fetch(`${env.BACKEND_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      query: document,
      variables,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    logger.error("GraphQL HTTP error:", { status: response.status, body: errorText });
    throw new GraphQLClientError(
      [{ message: `HTTP ${response.status}: ${response.statusText}` }],
      response.status,
    );
  }

  const json = (await response.json()) as GraphQLResponse<TData>;

  if (json.errors?.length) {
    logger.error("GraphQL errors:", json.errors);
    
    const hasAuthError = json.errors.some(
      (e) => e.message.toLowerCase().includes("unauthorized") ||
             e.message.toLowerCase().includes("unauthenticated") ||
             e.message.toLowerCase().includes("not authenticated") ||
             e.extensions?.code === "UNAUTHENTICATED"
    );
    
    throw new GraphQLClientError(json.errors, hasAuthError ? 401 : 400);
  }

  if (!json.data) {
    throw new GraphQLClientError([{ message: "No data returned from GraphQL" }]);
  }

  return json.data;
}

export function getQueryString(document: unknown): string {
  if (typeof document === "string") {
    return document;
  }
  
  if (typeof document === "object" && document !== null) {
    const doc = document as { loc?: { source?: { body?: string } } };
    if (doc.loc?.source?.body) {
      return doc.loc.source.body;
    }
  }
  
  throw new Error("Invalid GraphQL document");
}
