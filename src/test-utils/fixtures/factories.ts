import { TEST_TOTAL, TEST_PAGE_SIZE } from './constants'

export interface SearchDocFixture {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
}

/** A search doc for book `n` (1-based). Even-numbered books have a cover. */
export function buildSearchDoc(
  n: number,
  overrides: Partial<SearchDocFixture> = {},
): SearchDocFixture {
  return {
    key: `/works/OL${n}W`,
    title: `Book ${n}`,
    author_name: [`Author ${n}`],
    first_publish_year: 2000 + (n % 20),
    ...(n % 2 === 0 ? { cover_i: 1000 + n } : {}),
    ...overrides,
  }
}

/** One page of a `total`-sized result set, `pageSize` books per page. */
export function buildSearchResponse({
  total = TEST_TOTAL,
  page = 1,
  pageSize = TEST_PAGE_SIZE,
}: { total?: number; page?: number; pageSize?: number } = {}) {
  const start = (page - 1) * pageSize
  const count = Math.max(0, Math.min(pageSize, total - start))
  return {
    numFound: total,
    start,
    docs: Array.from({ length: count }, (_, i) => buildSearchDoc(start + i + 1)),
  }
}

export function buildWork(overrides: Record<string, unknown> = {}) {
  return {
    title: 'The Left Hand of Darkness',
    description: {
      type: '/type/text',
      value: 'A story about Gethen.\n----------\nSee also: [link](https://x)',
    },
    subjects: ['Science fiction', 'Gender'],
    first_publish_date: '1969',
    covers: [-1, 42],
    authors: [{ author: { key: '/authors/OL1A' } }],
    ...overrides,
  }
}

export function buildAuthor(overrides: Record<string, unknown> = {}) {
  return { name: 'Ursula K. Le Guin', ...overrides }
}
