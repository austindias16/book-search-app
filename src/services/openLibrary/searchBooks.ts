import { getJson } from './httpClient'
import { searchResponseSchema } from './schemas'
import { buildSearchUrl } from './urls'
import { toBookSummary } from './mappers'
import type { SearchPageResult, SearchParams } from './types'

export async function searchBooks(
  params: SearchParams,
  signal?: AbortSignal,
): Promise<SearchPageResult> {
  const data = searchResponseSchema.parse(await getJson(buildSearchUrl(params), signal))
  return {
    total: data.numFound,
    page: params.page,
    books: data.docs.map(toBookSummary),
  }
}
