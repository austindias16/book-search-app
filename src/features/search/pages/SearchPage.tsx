import { Flex } from 'antd'
import { useCallback } from 'react'
import { STRINGS, type SortOption } from '@/constants'
import { SearchHero } from '../components/SearchHero'
import { SearchInput } from '../components/SearchInput'
import { SearchResults } from '../components/SearchResults'
import { useBookSearch } from '../hooks/useBookSearch'
import { useSearchDraft } from '../hooks/useSearchDraft'
import { useSearchUrlState } from '../hooks/useSearchUrlState'

export function SearchPage() {
  const { query, sort, setSearch } = useSearchUrlState()
  const { draft, setDraft, submit, isTyping } = useSearchDraft({ query, setSearch })
  const search = useBookSearch(query, sort)

  const hasQuery = query.length > 0
  const busy = isTyping || (search.isFetching && !search.isFetchingNextPage)

  const handleSortChange = useCallback(
    (next: SortOption) => setSearch({ sort: next }, { replace: true }),
    [setSearch],
  )
  const handleRetry = useCallback(() => void search.refetch(), [search])
  const handleLoadMore = useCallback(() => void search.fetchNextPage(), [search])

  if (!hasQuery) {
    return <SearchHero draft={draft} onDraftChange={setDraft} onSubmit={submit} busy={busy} />
  }

  return (
    <Flex vertical gap="large">
      <title>{`“${query}”${STRINGS.app.titleSuffix}`}</title>
      <SearchInput value={draft} onChange={setDraft} onSubmit={submit} busy={busy} />
      <SearchResults
        query={query}
        sort={sort}
        books={search.books}
        total={search.total}
        isPending={search.isPending}
        isSuccess={search.isSuccess}
        isError={search.isError}
        hasNextPage={search.hasNextPage}
        isFetchingNextPage={search.isFetchingNextPage}
        isFetchNextPageError={search.isFetchNextPageError}
        onSortChange={handleSortChange}
        onRetry={handleRetry}
        onLoadMore={handleLoadMore}
      />
    </Flex>
  )
}
