import { QueryClient, type QueryClientConfig } from '@tanstack/react-query'
import { QUERY_RETRY_COUNT } from '@/constants'

export function createQueryClient(options: QueryClientConfig = {}): QueryClient {
  return new QueryClient({
    ...options,
    defaultOptions: {
      queries: {
        retry: QUERY_RETRY_COUNT,
        refetchOnWindowFocus: false,
        ...options.defaultOptions?.queries,
      },
    },
  })
}
