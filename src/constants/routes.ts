import { SEARCH_PARAMS } from './searchParams'
import { DEFAULT_SORT, type SortOption } from './sort'

export const ROUTE_PARAMS = { workId: 'id' } as const

export const ROUTE_PATHS = {
  home: '/',
  work: `/works/:${ROUTE_PARAMS.workId}`,
  notFound: '*',
} as const

/** State that the app attaches to router navigations. */
export interface LocationState {
  /** The search input made this navigation itself, so the input must not be resynced. */
  fromInput?: boolean
  /** The search string the user came from, used by "Back to results". */
  fromSearch?: string
}

export function buildSearchParams({
  query,
  sort,
}: {
  query?: string
  sort?: SortOption
}): URLSearchParams {
  const params = new URLSearchParams()
  if (!query) return params
  params.set(SEARCH_PARAMS.query, query)
  if (sort && sort !== DEFAULT_SORT) params.set(SEARCH_PARAMS.sort, sort)
  return params
}

export function buildSearchPath(options: { query?: string; sort?: SortOption } = {}): string {
  const search = buildSearchParams(options).toString()
  return search ? `${ROUTE_PATHS.home}?${search}` : ROUTE_PATHS.home
}

export function buildWorkPath(id: string): string {
  return `/works/${encodeURIComponent(id)}`
}
