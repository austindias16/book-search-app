import { Flex } from 'antd'
import { STRINGS, type SortOption } from '@/constants'
import { EmptyResult, ErrorResult } from '@/shared/components'
import { formatCount } from '@/shared/utils'
import type { BookSummary } from '@/services/openLibrary'
import { BookGrid } from './BookGrid'
import { BookGridSkeleton } from './BookGridSkeleton'
import { LoadMoreFooter } from './LoadMoreFooter'
import { ResultsHeader } from './ResultsHeader'

export interface SearchResultsProps {
  query: string
  sort: SortOption
  books: BookSummary[]
  total: number
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  isFetchNextPageError: boolean
  onSortChange: (sort: SortOption) => void
  onRetry: () => void
  onLoadMore: () => void
}

export function SearchResults(props: SearchResultsProps) {
  const { query, sort, total, isSuccess, onSortChange } = props
  const title = isSuccess
    ? STRINGS.search.resultsCount(formatCount(total), query, total === 1)
    : STRINGS.search.searching(query)

  return (
    <Flex vertical>
      <ResultsHeader title={title} sort={sort} onSortChange={onSortChange} />
      <ResultsBody {...props} />
    </Flex>
  )
}

function ResultsBody({
  query,
  books,
  total,
  isPending,
  isError,
  hasNextPage,
  isFetchingNextPage,
  isFetchNextPageError,
  onRetry,
  onLoadMore,
}: SearchResultsProps) {
  if (isPending) return <BookGridSkeleton />
  if (isError && books.length === 0) return <ErrorResult onRetry={onRetry} />
  if (books.length === 0) return <EmptyResult query={query} />

  return (
    <>
      <BookGrid books={books} />
      <LoadMoreFooter
        shown={books.length}
        total={total}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isFetchNextPageError={isFetchNextPageError}
        onLoadMore={onLoadMore}
      />
    </>
  )
}
