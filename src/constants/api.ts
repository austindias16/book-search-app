export const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org' as const
export const COVERS_BASE_URL = 'https://covers.openlibrary.org' as const

export const API_PATHS = {
  search: '/search.json',
  work: '/works',
  author: '/authors',
  cover: '/b/id',
  workKeyPrefix: '/works/',
} as const

export const API_QUERY_PARAMS = {
  query: 'q',
  page: 'page',
  limit: 'limit',
  fields: 'fields',
  sort: 'sort',
  defaultCover: 'default',
} as const

export const SEARCH_PAGE_SIZE = 24
export const FIRST_PAGE: number = 1

export const SEARCH_FIELDS = [
  'key',
  'title',
  'author_name',
  'first_publish_year',
  'cover_i',
  'edition_count',
] as const

export const COVER_SIZE = { small: 'S', medium: 'M', large: 'L' } as const
export type CoverSize = (typeof COVER_SIZE)[keyof typeof COVER_SIZE]
export const COVER_FILE_EXTENSION = '.jpg'
/** `default=false` makes a missing cover return 404, so `<img onError>` fires. */
export const DISABLE_DEFAULT_COVER = 'false'
export const NO_COVER_SENTINEL = -1

export const HTTP_STATUS = { notFound: 404 } as const
export const JSON_EXTENSION = '.json'
export const ACCEPT_JSON_HEADERS = { Accept: 'application/json' } as const
