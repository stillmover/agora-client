import { createClient, cacheExchange, fetchExchange } from 'urql'
import { env } from '@/shared/utils/env'

export const urqlClient = createClient({
  url: `${env.BACKEND_URL}/graphql`,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: {
    credentials: 'include',
  },
})
