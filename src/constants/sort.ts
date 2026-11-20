import { STRINGS } from './strings'

export const SORT_OPTION = {
  relevance: 'relevance',
  newest: 'new',
  oldest: 'old',
  title: 'title',
} as const

export type SortOption = (typeof SORT_OPTION)[keyof typeof SORT_OPTION]

export const DEFAULT_SORT: SortOption = SORT_OPTION.relevance

export function isSortOption(value: string | null): value is SortOption {
  return value !== null && (Object.values(SORT_OPTION) as readonly string[]).includes(value)
}

export const SORT_SELECT_OPTIONS = Object.values(SORT_OPTION).map((value) => ({
  value,
  label: STRINGS.sort.labels[value],
}))
