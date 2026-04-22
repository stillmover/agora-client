import { Client, cacheExchange, fetchExchange } from "urql";
import { env } from "@/shared/utils/env";
import { errorExchange } from "./error-exchange";

export const client = new Client({
  url: `${env.BACKEND_URL}/graphql`,
  exchanges: [cacheExchange, errorExchange, fetchExchange],
  fetchOptions: {
    credentials: "include",
  },
});
