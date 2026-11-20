import {
  API_PATHS,
  API_QUERY_PARAMS,
  COVER_FILE_EXTENSION,
  COVERS_BASE_URL,
  DEFAULT_SORT,
  DISABLE_DEFAULT_COVER,
  JSON_EXTENSION,
  OPEN_LIBRARY_BASE_URL,
  SEARCH_FIELDS,
  SEARCH_PAGE_SIZE,
  type CoverSize,
} from '@/constants'
import type { SearchParams } from './types'

export function buildSearchUrl({ query, sort, page }: SearchParams): URL {
  const url = new URL(API_PATHS.search, OPEN_LIBRARY_BASE_URL)
  url.searchParams.set(API_QUERY_PARAMS.query, query)
  url.searchParams.set(API_QUERY_PARAMS.page, String(page))
  url.searchParams.set(API_QUERY_PARAMS.limit, String(SEARCH_PAGE_SIZE))
  url.searchParams.set(API_QUERY_PARAMS.fields, SEARCH_FIELDS.join(','))
  if (sort !== DEFAULT_SORT) url.searchParams.set(API_QUERY_PARAMS.sort, sort)
  return url
}

export function buildWorkUrl(id: string): URL {
  return new URL(
    `${API_PATHS.work}/${encodeURIComponent(id)}${JSON_EXTENSION}`,
    OPEN_LIBRARY_BASE_URL,
  )
}

/** `key` is a full author key such as `/authors/OL1A`. */
export function buildAuthorUrl(key: string): URL {
  return new URL(`${key}${JSON_EXTENSION}`, OPEN_LIBRARY_BASE_URL)
}

export function buildCoverUrl(coverId: number, size: CoverSize): string {
  const url = new URL(
    `${API_PATHS.cover}/${coverId}-${size}${COVER_FILE_EXTENSION}`,
    COVERS_BASE_URL,
  )
  url.searchParams.set(API_QUERY_PARAMS.defaultCover, DISABLE_DEFAULT_COVER)
  return url.toString()
}

export function buildOpenLibraryWorkUrl(id: string): string {
  return new URL(`${API_PATHS.work}/${id}`, OPEN_LIBRARY_BASE_URL).toString()
}
