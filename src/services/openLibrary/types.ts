import type { SortOption } from '@/constants'

export type { SortOption }

export interface BookSummary {
  /** Work id without the `/works/` prefix, e.g. `OL45804W`. */
  id: string
  title: string
  authors: string[]
  firstPublishYear?: number
  coverId?: number
  editionCount?: number
}

export interface SearchPageResult {
  total: number
  page: number
  books: BookSummary[]
}

export interface SearchParams {
  query: string
  sort: SortOption
  page: number
}

export interface WorkDetail {
  id: string
  title: string
  description?: string
  subjects: string[]
  firstPublishDate?: string
  coverId?: number
  authors: string[]
}
