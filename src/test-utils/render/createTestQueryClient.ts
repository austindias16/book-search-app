import { QueryClient } from '@tanstack/react-query'

/** Retries off, so failing requests surface immediately in tests. */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
}
