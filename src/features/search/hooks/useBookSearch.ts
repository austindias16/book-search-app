import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
  FIRST_PAGE,
  queryKeys,
  SEARCH_PAGE_SIZE,
  SEARCH_STALE_TIME_MS,
  type SortOption,
} from '@/constants'
import { searchBooks } from '@/services/openLibrary'

export function useBookSearch(rawQuery: string, sort: SortOption) {
  const query = rawQuery.trim()

  const result = useInfiniteQuery({
    queryKey: queryKeys.search(query, sort),
    queryFn: ({ pageParam, signal }) => searchBooks({ query, sort, page: pageParam }, signal),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: (last) =>
      last.page * SEARCH_PAGE_SIZE < last.total && last.books.length > 0
        ? last.page + 1
        : undefined,
    enabled: query.length > 0,
    staleTime: SEARCH_STALE_TIME_MS,
  })

  const { data } = result
  const books = useMemo(() => data?.pages.flatMap((page) => page.books) ?? [], [data])
  const total = data?.pages.at(0)?.total ?? 0

  return { ...result, books, total }
}

export type BookSearchResult = ReturnType<typeof useBookSearch>
