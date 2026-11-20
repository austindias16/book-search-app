import { useCallback } from 'react'
import { useSearchParams } from 'react-router'
import {
  buildSearchParams,
  DEFAULT_SORT,
  isSortOption,
  SEARCH_PARAMS,
  type LocationState,
  type SortOption,
} from '@/constants'

export interface SearchUpdate {
  query?: string
  sort?: SortOption
}

export interface SetSearchOptions {
  replace?: boolean
  fromInput?: boolean
}

export type SetSearch = (update: SearchUpdate, options?: SetSearchOptions) => void

/** The URL is the source of truth for the query and sort. */
export function useSearchUrlState() {
  const [params, setParams] = useSearchParams()
  const query = params.get(SEARCH_PARAMS.query) ?? ''
  const sortParam = params.get(SEARCH_PARAMS.sort)
  const sort: SortOption = isSortOption(sortParam) ? sortParam : DEFAULT_SORT

  const setSearch = useCallback<SetSearch>(
    (update, { replace = false, fromInput = true } = {}) => {
      const next = buildSearchParams({
        query: (update.query ?? query).trim(),
        sort: update.sort ?? sort,
      })
      const state: LocationState = { fromInput }
      setParams(next, { replace, state })
    },
    [query, sort, setParams],
  )

  return { query, sort, setSearch }
}
