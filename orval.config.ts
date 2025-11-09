import { config } from 'dotenv'
import { resolve } from 'path'
import { defineConfig } from 'orval'

config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

const BACKEND_URL = process.env.VITE_BACKEND_URL ?? process.env.BACKEND_URL ?? 'http://localhost:8000'
const SWAGGER_URL = `${BACKEND_URL}/docs/json`

export default defineConfig({
  defaultClient: {
    input: {
      target: SWAGGER_URL,
    },
    output: {
      target: 'src/shared/api/endpoints',
      schemas: 'src/shared/api/models',
      client: 'react-query',
      httpClient: 'fetch',
      mode: 'tags-split',
      prettier: true,
      override: {
        mutator: {
          path: './src/shared/api/apiMutator.ts',
          name: 'apiMutator',
        },
        contentType: {
          include: ['application/json'],
        },
      },
    },
  },
})