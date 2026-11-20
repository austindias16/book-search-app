import type { SortOption } from './sort'

const QUERY_SCOPE = { search: 'search', work: 'work' } as const

export const queryKeys = {
  search: (query: string, sort: SortOption) => [QUERY_SCOPE.search, query, sort] as const,
  work: (id: string) => [QUERY_SCOPE.work, id] as const,
}
