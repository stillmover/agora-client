import { createClient, cacheExchange, fetchExchange } from "urql";
import { env } from "@/shared/utils/env";
import { errorExchange } from "./error-exchange";

export const urqlClient = createClient({
  url: `${env.BACKEND_URL}/graphql`,
  exchanges: [cacheExchange, errorExchange, fetchExchange],
  fetchOptions: {
    credentials: "include",
  },
});
